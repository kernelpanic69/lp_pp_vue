<template>
  <v-expansion-panel>
    <v-expansion-panel-header disable-icon-rotate>
      {{ constraint.name }}
      <template v-slot:actions>
        <v-tooltip bottom v-if="constraint.id === $store.state.objectiveId">
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-on="on" v-bind="attrs" color="success"
              >mdi-star-circle</v-icon
            >
          </template>
          <span>{{ $t("constraints.isTarget") }}</span>
        </v-tooltip>

        <v-dialog v-model="deleteConfirmShow">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="error">mdi-trash-can</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title>{{
              $t("constraints.deleteConfirmTitle")
            }}</v-card-title>

            <v-card-text>
              {{ $t("constraints.deleteConfirmText") }}
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" @click="deleteConfirmShow = false">{{
                $t("commonUi.cancel")
              }}</v-btn>
              <v-btn color="error" @click="deleteCon">
                <v-icon>mdi-trash-can</v-icon>
                {{ $t("commonUi.delete") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn icon>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-form class="mt-6">
        <v-text-field
          :label="$t('constraints.itemNameLabel')"
          :rules="nameRules"
          v-model="name"
          :counter="maxNameLen"
          outlined
        ></v-text-field>

        <v-textarea
          :label="$t('constraints.itemDescLabel')"
          :rules="descRules"
          v-model="description"
          :counter="maxDescLen"
          outlined
        ></v-textarea>

        <v-switch
          v-model="isObjective"
          :label="$t('model.isObjective')"
        ></v-switch>

        <v-select
          v-if="!isObjective"
          v-model="type"
          outlined
          :items="consTypes"
          :label="$t('constraints.itemTypeLabel')"
        >
        </v-select>

        <v-text-field
          v-if="!isObjective"
          :label="$t('constraints.itemValueLabel')"
          type="number"
          outlined
          v-model="value"
        ></v-text-field>

        <v-dialog width="auto" v-if="!isObjective">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs"
              >{{ $t("constraints.chartColor") }}
              <span
                :style="`
                  margin-left:10px;
                  display:block;
                  background-color:${constraint.color};
                  width:15px;
                  height:15px;
                  border-radius:50%;`"
              ></span>
            </v-btn>
          </template>

          <v-row justify="center">
            <v-card>
              <v-card-title>
                {{ $t("constraints.colorDlgTitle") }}
              </v-card-title>
              <v-card-text>
                <v-color-picker v-model="color"></v-color-picker>
              </v-card-text>
            </v-card>
          </v-row>
        </v-dialog>
      </v-form>

      <h5 class="text-h5 mb-4 mt-10">{{ $t("constraints.coefTitle") }}</h5>

      <v-card>
        <v-card-title>
          <v-text-field
            v-model="coefSearch"
            append-icon="mdi-magnify"
            :label="$t('constraints.coefSearch')"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :search="coefSearch"
          :headers="[
            {
              text: $t('constraints.coefVarLabel'),
              value: 'variable',
            },
            { text: $t('constraints.coefValLabel'), value: 'coef' },
            {
              text: $t('constraints.coefActions'),
              value: 'actions',
              width: 50,
            },
          ]"
          :items="coefs"
        >
          <template v-slot:[`item.actions`]="{ item }"
            ><v-dialog v-model="editDialog" max-width="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="editCoef(item)"
                  v-on="on"
                  v-bind="attrs"
                  small
                  color="success"
                >
                  <v-icon small> mdi-pencil</v-icon>
                  {{ $t("constraints.coefEdit") }}
                </v-btn>
              </template>
              <v-card>
                <v-card-title>{{ $t("constraints.coefEditDlg") }}</v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      v-model="newCoef"
                      type="number"
                      :label="$t('constraints.coefEditLabel')"
                    ></v-text-field>

                    <v-btn color="primary" @click="cancelEdit">
                      {{ $t("commonUi.cancel") }}
                    </v-btn>

                    <v-btn color="success" @click="commitEdit" class="ml-4">
                      {{ $t("commonUi.done") }}
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { mutations } from "@/store";
import { Constraint, ConsType, Variable } from "@/store/Model";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ConstraintItem extends Vue {
  @Prop() data!: any;

  deleteConfirmShow = false;
  valid = false;
  maxNameLen = 32;
  maxDescLen = 512;

  coefSearch = "";

  editDialog = false;
  editedCoef!: any;
  newCoef = 0.0;

  nameRules = [
    (name: string) => !!name || "Name is required",
    (name: string) => name.length <= this.maxNameLen || "Name is too long",
  ];

  descRules = [
    (desc: string) =>
      desc.length <= this.maxDescLen || "Description is too long",
  ];

  consTypes = [
    {
      text: this.$t("constraints.typeLt"),
      value: "lt",
    },
    {
      text: this.$t("constraints.typeEq"),
      value: "eq",
    },
    {
      text: this.$t("constraints.typeGt"),
      value: "gt",
    },
    {
      text: this.$t("constraints.typeFr"),
      value: "fr",
    },
  ];

  deleteCon() {
    this.$store.commit(mutations.DROP_CONSTRAINT, { id: this.constraint.id });
  }

  editCoef(coefItem: any) {
    this.editedCoef = coefItem;
    this.editDialog = true;
    this.newCoef = coefItem.coef;
  }

  cancelEdit() {
    this.editedCoef = undefined;
    this.editDialog = false;
  }

  commitEdit() {
    this.$store.commit(mutations.SET_CON_COEF, {
      conId: this.constraint.id,
      varId: this.editedCoef.varId,
      coef: this.newCoef,
    });

    console.log(this.constraint.coefs);

    this.cancelEdit();
  }

  get constraint(): Constraint {
    return this.$props.data;
  }

  get name(): string {
    return this.$store.state.constraints[this.constraint.id].name;
  }

  set name(newName: string) {
    if (newName && newName.length <= this.maxNameLen) {
      this.$store.commit(mutations.SET_CON_NAME, {
        id: this.constraint.id,
        name: newName,
      });
    }
  }

  get description(): string {
    return this.$store.state.constraints[this.constraint.id].description;
  }

  set description(newDesc: string) {
    if (newDesc && newDesc.length <= this.maxDescLen) {
      this.$store.commit(mutations.SET_CON_DESCRIPTION, {
        id: this.constraint.id,
        description: newDesc,
      });
    }
  }

  get type(): ConsType {
    return this.constraint.type;
  }

  set type(newType: ConsType) {
    this.$store.commit(mutations.SET_CON_TYPE, {
      id: this.constraint.id,
      type: newType,
    });
  }

  get value(): number {
    return this.constraint.value;
  }

  set value(newValue: number) {
    this.$store.commit(mutations.SET_CON_VALUE, {
      id: this.constraint.id,
      value: newValue,
    });
  }

  get coefs(): { variable: string; coef: number }[] {
    return Object.entries(this.constraint.coefs).map((it) => {
      const v: Variable = this.$store.state.variables[it[0]];
      return { varId: v.id, variable: v.name, coef: it[1] };
    });
  }

  get isObjective(): boolean {
    return this.constraint.id === this.$store.state.objectiveId;
  }

  set isObjective(value: boolean) {
    this.$store.commit(mutations.SET_OBJECTIVE, { conId: this.constraint.id });
  }

  get color(): string {
    return this.$store.state.constraints[this.constraint.id].color;
  }

  set color(newCol: string) {
    this.$store.commit(mutations.SET_CON_COLOR, {
      id: this.constraint.id,
      color: newCol,
    });
  }
}
</script>

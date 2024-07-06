export default class Roll2d125e extends dnd5e.dice.D20Roll {
  constructor(formula, data, options) {
    super(formula, data, options);
  }
  get valid2D12Roll() {
    return this.terms[0] instanceof Die && this.terms[0].faces === 12;
  }
  /** @override */
  get isCritical() {
    if (!this.valid2D12Roll || !this._evaluated) return undefined;
    if (!Number.isNumeric(this.options.critical)) return false;
    return this.dice[0].total >= this.options.critical;
  }

  /** @override */
  get isFumble() {
    if (!this.valid2D12Roll || !this._evaluated) return undefined;
    if (!Number.isNumeric(this.options.fumble)) return false;
    return this.dice[0].total <= this.options.fumble;
  }
  configureModifiers() {
    const d20 = this.terms[0];
    //array for possible modifiers on rolls
    //actually not used.
    d20.modifiers = [];

    //Turn d20 on 2d12
    if (!this.valid2D12Roll && this.validD20Roll) {
      d20.number = 2;
      d20.faces = 12;
    }

    // Assign critical and fumble thresholds
    const critical = Math.floor(this.data.flags?.Roll2d125e?.critical) || 22;
    const fumble = Math.floor(this.data.flags?.Roll2d125e?.fumble) || 4;

    d20.options.critical = this.options.critical = critical;
    d20.options.fumble = this.options.fumble = fumble;

    if (this.options.targetValue) {
      d20.options.target = this.options.targetValue;
    }

    // Re-compile the underlying formula
    this._formula = this.constructor.getFormula(this.terms);

    // Mark configuration as complete
    this.options.configured = true;
  }

  static EVALUATION_TEMPLATE = "modules/Roll2d125e/src/roll-dialog.hbs";

  async configureDialog(
    {
      title,
      defaultRollMode,
      defaultAction = D20Roll.ADV_MODE.NORMAL,
      chooseModifier = false,
      defaultAbility,
      template,
    } = {},
    options = {}
  ) {
    const critical = Math.floor(this.data.flags?.Roll2d125e?.critical) || 22;
    const fumble = Math.floor(this.data.flags?.Roll2d125e?.fumble) || 4;
    // Render the Dialog inner HTML
    const content = await renderTemplate(
      template ?? this.constructor.EVALUATION_TEMPLATE,
      {
        formulas: [{ formula: `${this.formula} + @bonus` }],
        defaultRollMode,
        rollModes: CONFIG.Dice.rollModes,
        chooseModifier,
        defaultAbility,
        abilities: CONFIG.DND5E.abilities,
        critical: `${critical}`,
        fumble: `${fumble}`,
      }
    );

    let defaultButton = "normal";

    // Create the Dialog window and await submission of the form
    return new Promise((resolve) => {
      new Dialog(
        {
          title,
          content,
          buttons: {
            normal: {
              label: game.i18n.localize("DND5E.Normal"),
              callback: (html) =>
                resolve(
                  this._onDialogSubmit(html, dnd5e.dice.D20Roll.ADV_MODE.NORMAL)
                ),
            },
          },
          default: defaultButton,
          close: () => resolve(null),
        },
        options
      ).render(true);
    });
  }

  _onDialogSubmit(html, advantageMode) {
    super._onDialogSubmit(html, advantageMode);
    const form = html[0].querySelector("form");

    // Append a disadvantage bonus term
    if (form.critical.value) {
      this.options.critical = form.critical.value;
    }
    // Append a disadvantage bonus term
    if (form.fumble.value) {
      this.options.fumble = form.fumble.value;
    }
    // Re-compile the underlying formula
    this._formula = this.constructor.getFormula(this.terms);
    return this;
  }
}

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
    if (this.options.critical === 20) {
      d20.options.critical = 22;
    }
    if (this.options.fumble === 1) {
      d20.options.fumble = 2;
    }
    if (this.options.targetValue) {
      d20.options.target = this.options.targetValue;
    }

    // Re-compile the underlying formula
    this._formula = this.constructor.getFormula(this.terms);

    // Mark configuration as complete
    this.options.configured = true;
  }

  static EVALUATION_TEMPLATE = "modules/Roll2d125e/src/roll-dialog.hbs";

  _onDialogSubmit(html, advantageMode) {
    super._onDialogSubmit(html, advantageMode);
    const form = html[0].querySelector("form");

    // Append a disadvantage bonus term
    if (form.disadvantage.value) {
      const operator = new OperatorTerm({ operator: "-" });
      const disadvantage = new NumericTerm({ number: form.disadvantage.value });
      this.terms = this.terms.concat(operator, disadvantage);
    }
    // Append a disadvantage bonus term
    if (form.advantage.value) {
      const operator = new OperatorTerm({ operator: "+" });
      const advantage = new NumericTerm({ number: form.advantage.value });
      this.terms = this.terms.concat(operator, advantage);
    }
    // Re-compile the underlying formula
    this._formula = this.constructor.getFormula(this.terms);
    return this;
  }
}

export default class Roll2d125e extends dnd5e.dice.D20Roll {
    constructor(formula, data, options) {
        super(formula, data, options);
      }
      configureModifiers() {
        if ( !this.validD20Roll ) return;
    
        const d20 = this.terms[0];
        //array for possible modifiers on rolls
        //actually not used.
        d20.modifiers = [];

        //Turn d20 on 2d12
        d20.number = 2;
        d20.faces = 12;

        // Assign critical and fumble thresholds
        if ( this.options.critical ) {
            if(this.options.critical !== 20){
                d20.options.critical = this.options.critical;
            } else{
                d20.options.critical = 12;
            }
        }
        if ( this.options.fumble ) d20.options.fumble = this.options.fumble;
        if ( this.options.targetValue ) d20.options.target = this.options.targetValue;
    
        // Re-compile the underlying formula
        this._formula = this.constructor.getFormula(this.terms);
    
        // Mark configuration as complete
        this.options.configured = true;
      }
    
}
import { default as Roll2d125e } from './src/2d12-roll.mjs';
import { extendChatMessage5e } from './chat-message-extended.mjs';

Hooks.on("init", () =>{
    game.Roll2d125e = {dice: {Roll2d125e}};
    // Record Configuration Values over the System Record
    CONFIG.Dice.D20Roll = Roll2d125e;
    
    // Register Roll Extensions
    CONFIG.Dice.rolls.push(Roll2d125e);

    //ExtendChatMessage5e
    extendChatMessage5e()
})
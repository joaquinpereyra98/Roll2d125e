export const extendChatMessage5e = function () {
  dnd5e.documents.ChatMessage5e.prototype._highlightCriticalSuccessFailure =
    function (html) {
      if (!this.isContentVisible || !this.rolls.length) return;
      const originatingMessage =
        game.messages.get(this.getFlag("dnd5e", "originatingMessage")) ?? this;
      const displayChallenge = originatingMessage?.shouldDisplayChallenge;

      // Highlight rolls where the first part is a d20 roll
      for (let [index, d20Roll] of this.rolls.entries()) {

        const d0 = d20Roll.dice[0];
        // WRAPP => changed d20 to 2d12
        if ((d0?.faces !== 12 && d0?.number !== 2) || d0?.values.length !== 2)
          continue;
        
        d20Roll = game.Roll2d125e.dice.Roll2d125e.fromRoll(d20Roll);
        const d = d20Roll.dice[0];
        const isModifiedRoll =
          "success" in d.results[0] ||
          d.options.marginSuccess ||
          d.options.marginFailure;
        if (isModifiedRoll) continue;
        // Highlight successes and failures
        const total = html.find(".dice-total")[index];
        if (!total) continue;
        if (d20Roll.isCritical) total.classList.add("critical");
        else if (d20Roll.isFumble) total.classList.add("fumble");
        else if (d.options.target && displayChallenge) {
          if (d20Roll.total >= d.options.target) total.classList.add("success");
          else total.classList.add("failure");
        }
      }
    };
};

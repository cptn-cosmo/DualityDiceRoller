/**
 * DR Quick Button — Foundry VTT v13
 * Adds a button near the chat dice/controls that runs the `/dr` command.
 */

Hooks.once("init", () => {
    console.log("DR Quick Button | Initializing");
});

// Sidebar chat
Hooks.on("renderChatLog", (_app, _html) => addDRButton());

// Mini/Popout chat
Hooks.on("renderChatPopout", (_app, _html) => addDRButton());

function addDRButton() {
    try {
        const container = document.createElement("div");
        container.className = "dr-quick-button-container";

        // Build button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ui-control icon fas-solid dr-quick-button";
        btn.title = "Duality Dice Roll";
        btn.setAttribute("aria-label", "Duality Dice Roll");

        // Inline SVG (or use icon.src = "modules/dr-quick-button/icons/dr.svg"; if external)
        btn.innerHTML = `<img src="systems/daggerheart/assets/icons/dice/duality/Daggerheart Foundry_g489.png" alt="DR" style="width:12px; height:16px;">
        `;
        btn.addEventListener("click", async () => {
            await runDRCommand();
        });

        container.appendChild(btn);

        // Find all roll-privacy divs and append the button
        const rollPrivacyDivs = document.querySelectorAll("#roll-privacy");
        rollPrivacyDivs.forEach(div => div.appendChild(container));

    } catch (err) {
        console.error("DR Quick Button | addDRButton error:", err);
    }
}



/** Run `/dr` as if typed into chat */
async function runDRCommand() {
    try {
        await ui?.chat?.processMessage("/dr");
    } catch (err) {
        console.error("DR Quick Button | Failed to send /dr command:", err);
        ui.notifications?.warn("Couldn't run /dr automatically. Try typing /dr in chat.");
    }
}


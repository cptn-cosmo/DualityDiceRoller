/**
 * DR Quick Button — Foundry VTT v13
 * Adds a button near the chat dice/controls that runs the `/dr` command.
 */

Hooks.once("init", () => {
    console.log("DR Quick Button | Initializing");
});

// Sidebar chat
Hooks.on("renderChatLog", (app, html) => addDRButton(html));

// Mini/Popout chat
Hooks.on("renderChatPopout", (app, html) => addDRButton(html));

function addDRButton(html) {
    try {
        // Avoid duplicates
        if (html.querySelector(".dr-quick-button")) return;

        const container =
        html.querySelector(".dice-tray") ||
        html.querySelector(".chat-controls .control-buttons") ||
        html.querySelector(".chat-controls") ||
        html;

        // Build button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dr-quick-button";
        btn.title = "Duality Dice Roll";
        btn.setAttribute("aria-label", "Duality Dice Roll");

        // Inline SVG (or use icon.src = "modules/dr-quick-button/icons/dr.svg"; if external)
        btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1020 1020">
        <defs>
        <style>
        .st0 {
            fill: #fff;
        }
        </style>
        </defs>
        <g id="Layer_4">
        <path class="st0" d="M999.42,558.73c0-.08-.01-.15-.02-.23-.01-.22-.03-.44-.08-.66-.02-.1-.05-.2-.07-.31-.05-.21-.12-.41-.2-.6-.02-.06-.03-.12-.06-.18-.02-.04-.04-.07-.06-.1-.1-.22-.22-.43-.36-.63-.04-.05-.07-.12-.1-.17,0,0,0-.01-.01-.02l-120.56-165.93c-.62-.86-1.5-1.49-2.51-1.82l-195.06-62.97c-.11-.04-.22-.05-.33-.08-.1-.02-.2-.05-.3-.07-.6-.11-1.21-.11-1.81,0-.1.02-.2.05-.3.07-.11.03-.22.04-.33.08l-8.57,2.77v10.51l5.11-1.65v161.78l-46.47,33.76-19.02,26.18,70.49-51.21,162.63,118.16-62.12,191.18h-201.02l-54.42-167.48-9.51,3.09,54.68,168.3-85.02,101.2-115.84-159.44v-62.56l-10,3.25v60.93c0,1.06.33,2.08.96,2.94l120.56,165.93s.05.05.07.08c.06.08.13.15.2.23.14.16.29.32.45.46.04.04.07.08.12.12.04.03.09.06.13.09.13.11.27.2.42.29.1.06.19.13.3.18.14.08.29.14.43.2.11.05.22.1.33.14.02,0,.04.02.06.03l195.06,63.38c.5.16,1.02.25,1.54.25s1.04-.08,1.54-.25l195.06-63.38s.04-.02.06-.03c.11-.04.22-.09.34-.14.15-.06.29-.12.43-.2.1-.05.2-.12.3-.18.15-.09.29-.19.42-.29.04-.03.09-.05.13-.09.04-.04.07-.08.11-.12.16-.15.31-.3.46-.47.06-.07.13-.14.19-.22.02-.03.05-.05.07-.08l120.56-165.93c.62-.85.96-1.88.96-2.94v-205.1s0-.02,0-.03ZM683.8,498.51v-161.78l186.98,60.36,115.95,159.59-138.81,61.06-164.12-119.24ZM678.8,987.92l-186.46-60.59,84.65-100.76h203.63l84.65,100.76-186.46,60.59ZM989.42,762.24l-115.84,159.44-85.02-101.2,62.81-193.32,138.05-60.73v195.81Z"/>
        </g>
        <g id="Layer_3">
        <g>
        <polygon class="st0" points="242.39 519.8 444.82 519.8 507.37 327.29 343.61 208.3 179.84 327.29 242.39 519.8"/>
        <polygon class="st0" points="174.6 321.12 339.57 201.26 339.57 33.43 148.54 95.1 30.41 257.69 174.6 321.12"/>
        <polygon class="st0" points="347.64 201.26 512.61 321.12 656.8 257.69 538.67 95.1 347.64 33.43 347.64 201.26"/>
        <polygon class="st0" points="515.39 328.71 452.28 522.96 541.11 628.7 659.22 466.13 659.22 265.43 515.39 328.71"/>
        <polygon class="st0" points="234.94 522.96 171.82 328.71 27.99 265.43 27.99 466.13 146.1 628.7 234.94 522.96"/>
        <polygon class="st0" points="445.87 527.87 241.34 527.87 152.68 633.4 343.61 695.44 534.53 633.4 445.87 527.87"/>
        </g>
        </g>
        </svg>
        `;

        btn.addEventListener("click", async () => {
            await runDRCommand();
        });

        // Insert as the 5th button in the row (index 4, since it's 0-based)
        const buttons = container.querySelectorAll("button");
        if (buttons.length >= 4) {
            container.insertBefore(btn, buttons[4]); // before the current 5th button
        } else {
            container.appendChild(btn); // fallback if fewer than 4 buttons
        }
    } catch (err) {
        console.error("DR Quick Button | addDRButton error:", err);
    }
}


/** Run `/dr` as if typed into chat */
async function runDRCommand() {
    const cmd = "/dr";

    try {
        if (ui?.chat?.processMessage) return await ui.chat.processMessage(cmd);
    } catch (e) {
        console.warn("DR Quick Button | ui.chat.processMessage failed:", e);
    }

    try {
        if (globalThis.ChatLog?.instance?.processMessage) {
            return await globalThis.ChatLog.instance.processMessage(cmd);
        }
    } catch (e) {
        console.warn("DR Quick Button | ChatLog.instance.processMessage failed:", e);
    }

    try {
        const form = ui.chat?.element?.querySelector?.("form#chat-form");
        const textarea = form?.querySelector?.("textarea[name='message']");
        if (form && textarea) {
            const prev = textarea.value;
            textarea.value = cmd;
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
            setTimeout(() => (textarea.value = prev ?? ""), 0);
            return;
        }
    } catch (e) {
        console.warn("DR Quick Button | Fallback submit failed:", e);
    }

    ui.notifications?.warn?.("Couldn't run /dr automatically. Try typing /dr in chat.");
}

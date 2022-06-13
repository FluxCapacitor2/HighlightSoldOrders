/*

HighlightSoldOrders made by FluxCapacitor2 for ChatTriggers 2.0.0+

Bazaar orders only show up in containers titled "Your Bazaar Orders".
Items that represent bazaar orders always have display names that start with "§a§lBUY§7: " or "§6§lSELL§7: ",
and when they are ready to be claimed, they have a line in their lore that contains the text "Click to claim!".

Credits:
- ExperimentationTable by Antonio32a: Code for highlighting slots in a GUI
*/

// List of slots that will be highlighted in the GUI
let slots = [];

/**
 * Ten times per second, this trigger looks at all of the items in the player's open container 
 * and adds claimable Bazaar orders to a list of slots that are highlighted in the "renderSlot" trigger below.
 */
register("step", () => {

    if (!isBazaarOrdersPageOpen()) {
        slots = [];
        return;
    };

    slots = Player.getContainer().getItems().reduce((acc, item, index) => {
        if (isBazaarOrder(item)) {
            acc.push(index);
        }
        return acc;
    }, []);

}).setFps(10);

register("renderSlot", (slot, _container, _event) => {
    if (slots.includes(slot.getIndex())) {
        highlightSlot(slot, 255, 0, 0, 200);
    }
})

/**
 * Returns true if the Item (ChatTriggers wrapper object for MC's ItemStack) represents a Bazaar order that can be claimed.
 * If so, it should be added to the list of highlighted slots.
 */
function isBazaarOrder(item) {
    return item != null && (item.getName().startsWith("§6§lSELL§7: ") || item.getName().startsWith("§a§lBUY§7: ")) &&
        item.getLore().some((line) => ChatLib.removeFormatting(line).includes("Click to claim!"))
}

function isBazaarOrdersPageOpen() {
    return Player.getContainer()?.getName() == "Your Bazaar Orders";
}

/**
 * Highlights a slot by drawing a 16x16 rectangle at its display position.
 */
function highlightSlot(slot, r, g, b, a) {
    Renderer.drawRect(Renderer.color(r, g, b, a), slot.getDisplayX(), slot.getDisplayY(), 16, 16);
}

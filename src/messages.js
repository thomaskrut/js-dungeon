export { messages };

const messages = {

    newMessages: [],
    messageColour: ["white", "silver", "gray", "dimgray", "dimgray", "dimgray"],
    recentMessages: [],

    addMessage: function (message) {
        this.newMessages.unshift(message);
        this.updateRecent();
    },

    updateRecent: function () {
        if (this.newMessages.length > 0) {
            if (messages.recentMessages.length > 6) messages.recentMessages.pop();
            this.recentMessages.unshift(this.newMessages.pop())
        }
    }


};
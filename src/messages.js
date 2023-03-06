export { messages };

const messages = {

    newMessages: [],
    messageColour: ["#FFF", "#CCC", "#888", "#444", "#222", "#111", "#000"],
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
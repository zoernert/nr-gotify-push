module.exports = function(RED) {
    function Receive(config) {
        RED.nodes.createNode(this,config);
        const axios = require("axios");
        const node = this;
        const storage = node.context();

        const poll = async function() {
          try {
            let url = new URL( config.server );
            const responds = await axios.get(url.origin+"/message?token="+config.token+"&limit=1");
            let lastMsgId = storage.get("lastId");
            const msgs = responds.data.messages;
            for(let i=0;i<msgs.length;i++) {
              if(msgs[i].id !== lastMsgId) {
                storage.set("lastId",msgs[i].id);
                node.send({payload:msgs[i]});
              }
            }
          } catch(e) {console.log(e);}
        }
        node.on('input', async function(msg) {
          poll();
        });

        setInterval(poll,60000);
    }
    RED.nodes.registerType("Gotify-Receive",Receive);
}

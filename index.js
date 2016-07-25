var settings=require('./settings.json');
var debug=$('debug')('ifttt:thermostat');
module.exports={name:"device", "triggers":[{name:"cycle", fields:[{ name:"interval", displayName:"Interval (min)"}, {name:"sensor", displayName:"Sensor Device"}, {name:"order", displayName:"Order Device"}],
    when:function(fields,callback){
        var internalTemperature=20;
        var externalTemperature=0;
        var order=20;
        device.status('meteo.temperature', null, function(external)
        {
            externalTemperature=external.status.celsius;
        });
        device.status(fields.sensor, null, function(value)
        {
            internalTemperature=value;
        });
        device.status(fields.order, null, function(value)
        {
            order=value;
            stop();
            start();
        });
        var start=function(){
            var interval= setInterval(function(){
                var result=Math.max(0, Math.min(1, settings.C*(order -internalTemperature)+settings.T*(order-externalTemperature)));
                debug('Power :',result*100, '%');
                if(result>0)
                {
                    callback({state:'on'})
                    setTimeout(function(){
                        callback({state:'off'})
                    }, fields.interval*result*60000);
                }
                else
                {
                    debug('C:',settings.C);
                    debug('T:',settings.T);
                    debug('order:',order);
                    debug('internalTemperature:',internalTemperature);
                    debug('externalTemperature:',externalTemperature);
                }
            }, fields.interval*60000);
            stop=function(){
                clearInterval(interval);
            };
        };
        var stop=null;
        start();
    }
}], "actions":[]};
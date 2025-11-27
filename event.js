// IMPROVEMENTS
// change names of functions in events:
//       - applyEvent() -> onActivation()
//       - unapplyEvent() -> onDeactivation()
//
// this way we can add another funtion to modify stuff while active

class Event {
    constructor( tp, start, end, commm_id){
        this.type = tp;
        
        this.start_time = time_to_seconds(start);
        this.end_time = time_to_seconds(end);;

        this.activated = false;

        this.commodity_id = commm_id;

        this.gif = null;
    }

    isHappening(time){
        return time >= this.start_time && time <= this.end_time;
    }
}


class PriceEvent extends Event{
    constructor(start, end, perc, comm_list){
        super("crash", start, end);
        this.percentage = perc; //percentage of the crash 0.3
        this.applied = false;
        this.commodity_list = comm_list;

        print("New Price Event Created")
    }

    applyEvent(){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.modifyPrice(this.percentage)
        }
        this.applied = true;
    }

    unapplyEvent(){}

}



class VolatilityEvent extends Event{
    constructor(start, end, multiplier, comm_list){
        super("happy_vola", start, end);
        this.multiplier = multiplier; //percentage of the crash 0.3
        this.applied = false;
        this.commodity_list = comm_list;
        print("New Happy Volatility Event Created")
    }
    
    applyEvent(){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.multiplier = k.multiplier *this.multiplier;
        }
        this.applied = true;
    }

    unapplyEvent(){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.multiplier = 1;
        }
        this.applied = false;
    }

}


function time_to_seconds(t){
    // if t is a string convert to seconds, else return t
    if (typeof t == "string"){
        let parts = t.replace(".",":").split(":");
        let res = parseInt(parts[0])*60*60 + parseInt(parts[1])*60;
        if (parts.length == 3) res += parseInt(parts[2]);
        return res;
    }
    return t;
}
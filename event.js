// IMPROVEMENTS
// change names of functions in events:
//       - applyEvent() -> onActivation()
//       - unapplyEvent() -> onDeactivation()
//
// this way we can add another funtion to modify stuff while active

class Event {
    constructor( tp, start, end, commm_id){
        this.type = tp;
        
        this.start_time = start;
        this.end_time = end;

        this.activated = false;

        this.commodity_id = commm_id;
    }

    isHappening(time){
        return time >= this.start_time && time <= this.end_time;
    }
}


class CrashEvent extends Event{
    constructor(start, end, crash_size, comm_list){
        super("crash", start, end);
        this.percentage = crash_size; //percentage of the crash 0.3
        this.applied = false;
        this.commodity_list = comm_list;

        print("New Crash Event Created")
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


class FomoEvent extends Event{
    constructor(start, end, crash_size, comm_list){
        super("fomo", start, end);
        this.percentage = crash_size; //percentage of the crash 0.3
        this.applied = false;
        this.commodity_list = comm_list;
        print("New Fomo Event Created")
    }
    
    applyEvent(){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.modifyPrice(-this.percentage)
        }
        this.applied = true;
    }

    unapplyEvent(){}
}



class HappyVolatilityEvent extends Event{
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
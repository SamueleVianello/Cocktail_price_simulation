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

}
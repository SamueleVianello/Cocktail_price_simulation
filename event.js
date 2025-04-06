class Event {
    constructor( tp, start, end, commm_id){
        this.type = tp;
        
        this.start_time = start;
        this.end_time = end;

        this.active = false;

        this.commodity_id = commm_id;
    }

    isHappening(time){
        return time >= this.start_time && time <= this.end_time;
    }

}


class CrashEvent extends Event{
    constructor(start, end, crash_size){
        super("crash", start, end);
        this.percentage = crash_size; //percentage of the crash
    }

    applyEvent(){

    }

}
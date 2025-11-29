// IMPROVEMENTS
// change names of functions in events:
//       - applyEvent() -> onActivation()
//       - unapplyEvent() -> onDeactivation()
//
// this way we can add another funtion to modify stuff while active

class Event {
    constructor( tp, id, name, start, end, comm_list,gif_path){
        this.type = tp;
        this.id = id;
        this.name = name;
        this.start_time = time_to_seconds(start);
        this.end_time = time_to_seconds(end);;

        this.activated = false;

        this.commodity_list = comm_list;

        this.gif_handler = new GifHandler(gif_path,time_to_seconds(start));
    }

    isHappening(time){
        let is_happening = time >= this.start_time && time <= this.end_time;
        if (is_happening) {
            this.gif_handler.check(time);
        }
        return is_happening;
    }
}


class PriceEvent extends Event{
    constructor(tp, id, name, start, end, commm_id, perc_change,gif_path){
        super(tp, id, name, start, end, commm_id,gif_path);
        this.percentage = perc_change; //percentage of the crash 0.3
        this.applied = false;
    }

    applyEvent(time){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.modifyPrice(this.percentage)
        }
        //initialize gif 
        this.gif_handler.duration = this.end_time-this.start_time;
        this.gif_handler.activate(time);
        this.applied = true;
    }

    unapplyEvent(){
        this.gif_handler.deactivate();
    }

}



class VolatilityEvent extends Event{
    constructor(tp, id, name, start, end, commm_id, multiplier,gif_path){
        super(tp, id, name, start, end, commm_id,gif_path);
        this.multiplier = multiplier; //percentage of the crash 0.3
        this.applied = false;
    }
    
    applyEvent(time){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.multiplier = k.multiplier *this.multiplier;
        }
        //initialize gif 
        this.gif_handler.duration = this.end_time-this.start_time;
        this.gif_handler.activate(time);
        this.applied = true;
    }

    unapplyEvent(){
        for (let k of this.commodity_list) {
            //console.log(""+k.id+" "+k.current_order.vol)
            k.multiplier = 1;
        }
        this.gif_handler.deactivate();
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




class GifHandler {
    constructor(path, start_time, duration= 10 ){
        this.path = path;
        this.gif = createImg(path,"");
        this.gif.hide(); //hides the gif's html element
        

        this.duration = duration; // in seconds like everything
        this.active= false;
        this.start_time = start_time;
    }

    check(t){
        //console.log(t,this.start_time,this.active, this.duration)
        if(this.active){
            if(t>(this.start_time+this.duration)) this.deactivate()
        }
    }

    activate(time){
        let gif_h = 0.25*height;
        let gif_w = gif_h *this.gif.width / this.gif.height;

        this.gif.size(gif_w,gif_h)
        this.gif.position(width/2-gif_w/2, height/2-gif_h/2);
        this.active= true;
        this.start_time = time;
        this.gif.show();
    }

    deactivate(){
        this.active = false;
        this.gif.hide();
    }
}
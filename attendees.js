import { writeFileSync, readFileSync } from "fs";
const fileLocation = "/attendees.json";

export default class Attendees {
    constructor() {
        const data = readFileSync(fileLocation, "utf8");
        this.attendees_names = [];
        this.attendees_id = [];

        for (let i of data) {
            this.attendees_names.push(i.name);
            this.attendees_id.push(i.id);
        }
    }
    addAttendee(name, id) {
        this.attendees_names.push(name);
        this.attendees_id.push(id);
        this.writeToFile();
    }
    removeAttendee(name, id) {
        this.attendees_names = this.attendees_names.filter(value => value === name);
        this.attendees_id = this.attendees_names.filter(value => value === id);
        this.writeToFile();
    }
    findAttendee(id) {
        for (let i of this.attendees_id) {
            if (i === id) { return true; }
        }
        return false;
    }
    writeToFile() {
        let write_data = [];

        for (let i = 0; i < this.attendees_id.length; ++i) {
            write_data.push({name: this.attendees_names[i], id: this.attendees_id[i]});
        }

        writeFileSync(fileLocation, write_data);
    }
    get getAttendeeIds() {
        return this.attendees_id;
    }
}

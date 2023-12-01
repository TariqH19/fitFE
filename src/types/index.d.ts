export interface Exercises{
    name: string;
    muscle_group: string;
    notes: string;
    user: string;
}

export interface Workouts{
    name: string;
    exercises:Exercises[];
    notes: string;
    user: string;
}

export interface User{
    name: string;
    email: string;
    password: string;
}

export interface Splits{
    name: string;
    workout: Workouts[];
    notes: string;
    dateStart: Date;
    dateEnd: Date;
    user: string;
}

export interface Sessions{
    name: string;
    workout: string;
    notes: string;
    user: string;
}
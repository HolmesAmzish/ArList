export interface Group {
    id: string;
    name: string;
    description: string;
}

export interface Todo {
    id: string;
    group: string;
    title: string;
    isCompleted: boolean;
    createdAt: Date;
    deadline: Date;
}
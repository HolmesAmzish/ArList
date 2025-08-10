import {useState} from "react";

interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    scheduled?: boolean;
    startTime?: string;
    endTime?: string;
    duration?: number;
    createdAt?: string;
}

interface TodoDetailProps {
    todo: Todo | null;
    onUpdate: (updatedTodo: Todo) => void;
}

const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return "Not set";
    return new Date(dateTime).toLocaleString("zh-CN");
};

export const TodoDetail = ({todo, onUpdate}: TodoDetailProps) => {
    const [editing, setEditing] = useState(false);
    const [editedTodo, setEditedTodo] = useState<Todo | null>(null);

    if (!todo) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
                <p className="text-gray-500">Select one to see details</p>
            </div>
        );
    }

    const handleEdit = () => {
        setEditedTodo({...todo});
        setEditing(true);
    };

    const handleSave = async () => {
        if (!editedTodo) return;

        try {
            const response = await fetch(`/api/todo/modify/${editedTodo.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedTodo),
            });

            if (response.ok) {
                onUpdate(editedTodo);
                setEditing(false);
            }
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 h-full overflow-y-auto">
            {editing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={editedTodo?.title || ""}
                            onChange={(e) =>
                                setEditedTodo({
                                    ...editedTodo!,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={editedTodo?.description || ""}
                            onChange={(e) =>
                                setEditedTodo({
                                    ...editedTodo!,
                                    description: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border rounded"
                            rows={4}
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={editedTodo?.completed || false}
                            onChange={(e) =>
                                setEditedTodo({
                                    ...editedTodo!,
                                    completed: e.target.checked,
                                })
                            }
                            className="h-4 w-4 text-blue-500 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Completed</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            value={editedTodo?.dueDate?.substring(0, 16) || ""}
                            onChange={(e) =>
                                setEditedTodo({
                                    ...editedTodo!,
                                    dueDate: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={editedTodo?.scheduled || false}
                            onChange={(e) =>
                                setEditedTodo({
                                    ...editedTodo!,
                                    scheduled: e.target.checked,
                                })
                            }
                            className="h-4 w-4 text-blue-500 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Scheduled</span>
                    </div>
                    {editedTodo?.scheduled && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Begin
                                </label>
                                <input
                                    type="datetime-local"
                                    value={editedTodo?.startTime?.substring(0, 16) || ""}
                                    onChange={(e) =>
                                        setEditedTodo({
                                            ...editedTodo!,
                                            startTime: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End
                                </label>
                                <input
                                    type="datetime-local"
                                    value={editedTodo?.endTime?.substring(0, 16) || ""}
                                    onChange={(e) =>
                                        setEditedTodo({
                                            ...editedTodo!,
                                            endTime: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                </label>
                                <input
                                    type="number"
                                    value={editedTodo?.duration || 0}
                                    onChange={(e) =>
                                        setEditedTodo({
                                            ...editedTodo!,
                                            duration: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </>
                    )}
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-2xl text-gray-800">{todo.title}</h2>
                    {todo.description && (
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {todo.description}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p
                                className={`font-medium ${
                                    todo.completed ? "text-green-500" : "text-yellow-500"
                                }`}
                            >
                                {todo.completed ? "Completed" : "Not completed"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Creation time</p>
                            <p>{formatDateTime(todo.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Deadline</p>
                            <p>{formatDateTime(todo.dueDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Scheduled</p>
                            <p>{todo.scheduled ? "Yes" : "No"}</p>
                        </div>
                        {todo.scheduled && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500">Begin</p>
                                    <p>{formatDateTime(todo.startTime)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">End</p>
                                    <p>{formatDateTime(todo.endTime)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p>{todo.duration} min</p>
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
};

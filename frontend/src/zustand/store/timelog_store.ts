import { Log } from "@/model/log.ts";
import { create } from "zustand";
import axios from "axios";

export type TimelogStoreType = {
    timelogs: Log[];
    addTimeLog: ({token, project, task, date, hoursSpent, taskStatus}:
                     {token: string, project: string, task: string, date: Date, hoursSpent: number, taskStatus: string}) => Promise<boolean>;
    getUserLogs: ({token, user}: {token: string, user: string}) => Promise<Log[]>;
    getLogs: ({token}: {token: string}) => Promise<Log[]>;
}

export const timeLogStore = create<TimelogStoreType>(
    (set) => ({
        timelogs: [],
        addTimeLog: async ({token, project, task, date, hoursSpent, taskStatus}) => {
            try {
                const response = await axios.post('http://localhost:3003/api/timelog/add', {
                    project,
                    task,
                    date,
                    hoursSpent,
                    taskStatus,
                }, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.status === 200) {
                    console.log(response.data)
                    const newLog = response.data as Log;
                    set((state) => ({ timelogs: [...state.timelogs, newLog] }));
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error adding time log:", error);
                return false;
            }
        },
        getUserLogs: async ({token, user}) => {
            try {
                const response = await axios.get(`http://localhost:3003/api/timelog/logs/${user}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.status === 200) {
                    console.log(response.data)
                    const logs = response.data as Log[];
                    set({ timelogs: logs });
                    return logs;
                }
                return [];
            } catch (error) {
                console.error("Error fetching user logs:", error);
                return [];
            }
        },
        getLogs: async ({token}) => {
            try {
                const response = await axios.get('http://localhost:3003/api/timelog/logs', {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.status === 200) {
                    console.log(response.data)
                    const logs = response.data as Log[];
                    set({ timelogs: logs });
                    return logs;
                }
                return [];
            } catch (error) {
                console.error("Error fetching all logs:", error);
                return [];
            }
        },
    })
);

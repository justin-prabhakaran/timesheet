import { create } from 'zustand';
import { User } from '@/model/user.ts';
import axios from 'axios';
type UserStoreType = {
    user: User | undefined;
    login: (userName: string, password: string) => Promise<boolean>;
    register: (userName : string, password : string) => Promise<void>;
    getAllUsers : (token : string) => Promise<User[]>;
};

export const userStore = create<UserStoreType>((set) => ({
    user: undefined,

    login: async (userName, password) => {
        try {
            const response = await axios.post<User>('http://localhost:3003/api/user/login',{
                userName,
                password
            });
            console.log(response);
            if (response.status != 200) throw new Error('Login failed');

            const user: User = response.data;

            console.log(user);

            set({ user });

            return true;
        } catch (error) {
            console.error('Error logging in:', error);
            return false;
        }
    },

    register: async (userName:string, password : string) => {
        //TODO : impl
    },

    getAllUsers : async (token ) => {
        try {
            const response = await axios.get<User[]>('http://localhost:3003/api/user/users', {
                headers : {
                    Authorization : "Bearer " + token
                }
            });

            if(response.status == 200){
                return response.data;
            }
            return [];
        }catch (e){
            console.log(e);
            throw new Error('Error getting all users');
        }
    }
}));

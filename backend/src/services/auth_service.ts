import bcrypt from 'bcrypt';
import { User } from '../models/user_model';
import { tokenService } from './token_service';
import type { UserModel } from '../models/user_model';

type UserAuth = {
	username: string;
	email: string;
	password: string;
};

export const verifyUserPassword = async ({ username, password }: Omit<UserAuth, 'email'>) => {
	try {
		const findUserPasswordHash = async (username: string) => {
			const user = (await User.findOne({
				where: { username: username },
			})) as UserModel | null;

			if (!user) {
				throw new Error('Invalid login');
			}
			return user.password_hash;
		};

		let password_hash = await findUserPasswordHash(username);

		return await bcrypt.compare(password, password_hash);
	} catch (err) {
		throw err;
	}
};
export const authService = {
	registerUserService: async ({ username, email, password }: UserAuth) => {
		const saltRounds = 10;
		try {
			const hash = await bcrypt.hash(password, saltRounds);
			const registerUser = await User.create({ username, email, password_hash: hash });
			return registerUser;
		} catch (err) {
			throw err;
		}
	},

	loginUserService: async ({ username, password }: Omit<UserAuth, 'email'>) => {
		try {
			const pass = await verifyUserPassword({ username, password });
			if (pass) {
				const refresh = await tokenService.signRefresh(username);
				const token = await tokenService.signJWT(username);
				return { refresh, token };
			}
			throw new Error('Invalid login');
		} catch (err) {
			throw err;
		}
	},
};

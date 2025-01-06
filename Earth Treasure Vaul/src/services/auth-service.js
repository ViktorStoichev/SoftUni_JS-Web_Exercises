import { jwt } from "../lib/jwt.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

const authService = {
    async register( email, password, rePassword) {
        const user = await User.findOne({ email });

        if (user) {
            throw new Error('User already exists!');
        }

        if (password !== rePassword) {
            throw new Error('Password missmatch!');
        }

        const newUser = await User.create({ email, password });

        return this.generateToken(newUser);
    },
    async login(email, password) {
        // Get user from db
        const user = await User.findOne({ email });

        // Throw error if user doesn't exists
        if (!user) {
            throw new Error('Invalid user or password!');
        };

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid user or password!');
        }

        return this.generateToken(user);
    },
    async generateToken(user) {
        // Generate token
        const payload = {
            _id: user._id,
            email: user.email
        };

        const header = { expiresIn: '2h' };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, header);

        // Return token
        return token;
    }
};

export default authService;
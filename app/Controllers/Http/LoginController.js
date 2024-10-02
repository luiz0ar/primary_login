'use strict'

const { validate } = use('Validator');
const Database = use('Database');
const LogError = use('App/Models/LogErrors');
const User = use('App/Models/User');
const Token = use('App/Models/Token');
const Mail = use('Mail');
const Env = use('Env');
const Hash = use('Hash');



class LoginController {

    async login({ auth, request, response }) {
        try {
            const { username, password } = request.all()
            const validation = await validate(request.all(), {
                username: 'required|min:3|max:30|regex:^[a-zA-Z0-9_]*$',
                password: 'required|min:8'
            })

            if (validation.fails()) {
                return response.status(400).json(validation.messages())
            }

            const user = await User.findBy('username', username)

            if (!user) {
                return response.status(404).json({ message: 'Usuário ou senha inválidos' })
            }

            if (user.blocked_at) {
                return response.status(403).json({ message: 'Sua conta foi bloqueada. Ligue para (35)98712-9806' })
            }

            const trx = await Database.beginTransaction()

            try {
                const ret = await auth.attempt(username, password)

                user.tries = 0
                user.blocked_at = null
                await user.save(trx)
                await trx.commit()
                const permissions = await user.getPermissions();
                return response.status(200).json({
                    user: {
                        id: user.id,
                        username: user.username,
                    },
                    permissions: permissions,
                    ret
                });

            } catch (authError) {
                user.tries += 1
                if (user.tries === 5) {
                    user.blocked_at = new Date()
                }

                await user.save(trx)
                await trx.commit()
                return response.status(401).json({ message: 'Usuário ou senha inválidos' })
            }
        } catch (error) {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "login",
                message: error.message
            }

            await LogError.create(errorLog);

            console.error('Ocorreu um erro:', error.message)
            return response.status(404).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' })
        }
    }

    async index({ response }) {
        try {
            const users = await User.all();
            return response.json(users);
        } catch (error) {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "index",
                message: error.message
            }

            await LogError.create(errorLog);

            console.error('Ocorreu um erro:', error.message)
            return response.status(404).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' })
        }
    }

    async show({ params, response }) {
        try {
            const user = await User.findOrFail(params.id);
            return response.json(user);
        } catch (error) {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "show",
                message: error.message
            }

            await LogError.create(errorLog);

            console.error('Ocorreu um erro:', error.message)
            return response.status(404).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' })
        }
    }

    async store({ request, session, response }) {
        try {
            const rules = {
                email: 'required|email|unique:users,email',
                username: 'required|unique:users,username|min:3|max:30|regex:^[a-zA-Z0-9_]*$',
                password: 'required|min:8'
            };

            const validation = await validate(request.all(), rules);

            if (validation.fails()) {
                session.withErrors(validation.messages()).flashExcept(['password']);
                return response.redirect('back');
            }
            const { username, email, password, roles = [], permissions = [] } = request.all();

            const existingUser = await User.findBy('username', username);
            if (existingUser) {
                return response.status(400).json({ message: 'Usuário já existe.' });
            }

            const user = new User();
            user.username = username;
            user.email = email;
            user.password = password;
            await user.save();

            if (roles.length > 0) {
                await user.roles().attach(roles);
            }

            if (permissions.length > 0) {
                await user.permissions().attach(permissions);
            }

            await user.loadMany(['roles', 'permissions']);
            return response.status(201).json(user);
        } catch (error) {

            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "store",
                message: error.message
            };

            await LogError.create(errorLog);

            console.error('Ocorreu um erro:', error.message);

            return response.status(500).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' });
        }
    }


    async update({ params, request, session, response }) {
        try {
            const rules = {
                username: 'unique:users, username|min:3|max:30|regex:^[a-zA-Z0-9_]*$',
                email: 'email|unique:users, email',
                password: 'min:8'
            };
            const data = request.only(['username', 'email', 'password', 'role', 'permission']);

            const validation = await validate(data, rules);

            if (validation.fails()) {
                const errors = validation.messages();

                if (errors.some(error => error.rule === 'unique')) {
                    return response.status().json({ message });
                }

                session.withErrors(errors)
                return response.redirect('back');
            }

            const user = await User.findOrFail(params.id);
            user.merge(data);

            await user.save();
            return response.json(user);

        } catch (error) {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "update",
                message: error.message
            }

            await LogError.create(errorLog);

            console.error('Ocorreu um erro:', error.message)
            return response.status(404).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' })
        }
    }


    async destroy({ params, response }) {
        try {
            const user = await User.findOrFail(params.id);
            await user.delete();
            return response.json({ message: 'Usuário deletado' });
        } catch (error) {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "destroy",
                message: error.message
            }
            let user = await User.find(1)
            user.role_id = 1

            await user.save()

            await LogError.create(errorLog);

            console.error('Ocorreu um erro:', error.message)
            return response.status(404).json({ message: 'Ocorreu um erro, favor acionar a equipe de TI' })
        }
    }

    async permissionUser({ response, request }) {
        try {
            const { id, permission } = request.all()

            const user = await User.find(id)
            await user.permissions().attach(permission)

            return response.status(200).json({ message: 'Permissão adicionada ao usuário.' })
        } catch {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "permissionUser",
                message: error.message
            }

            await LogError.create(errorLog);
            return { error: 'Usuário não econtrado', details: error.message }
        }
    }

    async deletePermissionUser({ response, request }) {
        try {
            const { id, permission } = request.all()

            const user = await User.find(id)
            await user.permissions().detach(permission)

            return response.status(200).json({ message: 'Permissão removida ao usuário.' })
        } catch {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "deletePermissionUser",
                message: error.message
            }

            await LogError.create(errorLog);
            return { error: 'Usuário não econtrado', details: error.message }
        }
    }

    async roleToUser({ request, response }) {
        try {
            const { id, role } = request.all()

            const user = await User.find(id)
            await user.roles().attach(role)

            return response.status(200).json({ message: 'Role adicionada com sucesso ao usuário.' })
        } catch {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "roleToUser",
                message: error.message
            }

            await LogError.create(errorLog);
            return { error: 'Role não econtrada', details: error.message }
        }
    }

    async deleteroleToUser({ request, response }) {
        try {
            const { role, id } = request.all()

            const user = await User.find(id)
            await user.roles().detach(role)

            return response.status(200).json({ message: 'Role removida com successo do usuário.' })
        } catch {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "deleteroleToUser",
                message: error.message
            }

            await LogError.create(errorLog);
            return { error: 'Role não econtrada', details: error.message }
        }
    }

    async forgot({ request, response, auth }) {
        try {
            const username = request.input('username');
            const user = await User.findBy('username', username);
            const token = await auth.generate(user)

            if (user) {
                await Token.create({
                    user_id: user.id,
                    token: token.token,
                    type: 'Bearer',
                    created_at: new Date(),
                    updated_at: new Date(),
                })

                user.url = Env.get('APP_URL');
                user.token = token.token

                await Mail.send('emails/welcome', user.toJSON(), (message) => {
                    message
                        .to(user.email)
                        .from('portal.minasul@outlook.com')
                        .subject('Esqueceu a senha');
                });
                return response.json({ message: 'Um e-mail de recuperação foi enviado para este usuário.' });
            }

            return response.status(404).json({ message: 'Um e-mail de recuperação foi enviado para este usuário.' });
        } catch (error) {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "forgot",
                message: error.message
            };

            await LogError.create(errorLog);
            return response.status(500).json({ message: error.message });
        }
    }

    async reset({ request, response, params }) {
        try {
            const tokenValue = params.token;
            const token = await Token.query()
                .where('token', tokenValue)
                .where('type', 'Bearer')
                .first();

            if (!token) {
                return response.status(404).json({ message: 'Token inválido.' });
            }

            const tokenCreatedAt = new Date(token.created_at);
            const tokenRevoked = (new Date() - tokenCreatedAt) / 1000 > 7200;
            if (tokenRevoked) {
                return response.status(400).json({ message: 'Token expirado.' });
            }

            const validation = await validate(request.only(['password']), {
                password: 'required|min:8',
            });

            if (validation.fails()) {
                return response.status(400).json(validation.messages());
            }

            const user = await User.find(token.user_id);
            if (!user) {
                return response.status(404).json({ message: 'Usuário não encontrado.' });
            }

            user.password = await Hash.make(request.input('password'));
            await user.save();

            // token.is_revoked = false;
            await token.save();

            return response.json({ message: 'Senha redefinida com sucesso.' });
        } catch (error) {
            const errorLog = {
                jsonError: JSON.stringify(error),
                controller: "LoginController",
                function: "reset",
                message: error.message
            };

            await LogError.create(errorLog);
            return response.status(500).json({ message: error.message });
        }
    }

}
module.exports = LoginController

// Importa Passport.js, la librería principal para autenticación.
import passport from "passport";

// Importa la estrategia JWT de Passport para autenticar usando JSON Web Tokens.
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// Importa la estrategia de Google OAuth 2.0 (comentada en este archivo).
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Importa la estrategia de Facebook para autenticación con Facebook Login.
import { Strategy as FacebookStrategy } from 'passport-facebook';

// Importa el modelo de usuario para consultar o registrar usuarios en la base de datos.
import usersModel from "../models/User-models.js";

// Importa la configuración con claves secretas y datos sensibles desde el archivo de configuración.
import config from "./config.js";


// Función para extraer el token JWT desde una cookie específica.
// Passport necesita saber cómo obtener el token del request.
const cookieExtractor = req => {
    let token = null;
    
    if (req && req.cookies) {
        token = req.cookies['CookieToken'] // Extrae el token desde la cookie 'CookieToken'
    }
    return token;
};


// Función principal para inicializar Passport y configurar las estrategias.
const initializePassport = () => {
    
    // Estrategia JWT
    // Se utiliza para autenticar usuarios mediante un token en la cookie.
    passport.use('jwt', new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Extrae token usando cookieExtractor
        secretOrKey: config.jwtPrivateKey // Clave secreta para validar el JWT
      }, 
      async (jwt_payload, done) => {
        try {
          // Si el token es válido, se retorna el usuario contenido en el payload
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    ));
    
    // ------------------ Google Strategy (comentada) ------------------
    /*
    // Estrategia OAuth con Google (comentada, puede habilitarse si se quiere usar)
    passport.use(new GoogleStrategy({
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: "/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await usersModel.findOne({ googleId: profile.id });
          
          if (user) {
            return done(null, user);
          } else {
            user = new usersModel({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              isConfirmed: true
            });
            await user.save();
            return done(null, user);
          }
        } catch (error) {
          return done(error, false);
        }
      }
    ));
    */

    // ------------------ Facebook Strategy ------------------
    // Estrategia OAuth con Facebook
   /* passport.use(new FacebookStrategy({
      clientID: config.facebookClientID,
      clientSecret: config.facebookClientSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'emails'] // Campos del perfil que se desean obtener
    }, 
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verifica si el usuario ya existe en la base de datos
        let user = await usersModel.findOne({ facebookId: profile.id });
        
        if (user) {
          return done(null, user); // Usuario encontrado, continúa
        } else {
          // Si no existe, se registra uno nuevo
          user = new usersModel({
            username: profile.displayName,
            email: profile.emails[0].value,
            facebookId: profile.id,
            isConfirmed: true
          });
          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error, false); 
      }
    }));

    // Serializa el usuario: define qué guardar en la sesión (por ejemplo, solo el ID).
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    // Deserializa: recibe el ID guardado y recupera el usuario completo desde la base de datos.
    passport.deserializeUser(async (_id, done) => {
      try {
        let user = await usersModel.findById(_id);
        if (!user) {
          return done(new Error('User not found'), null);  
        }
        done(null, user);
      } catch (error) {
        done(error, null); 
      }
    });*/
};

// Exporta la función para ser utilizada en el servidor principal.
export default initializePassport;

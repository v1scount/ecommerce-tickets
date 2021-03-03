require('dotenv').config();
const  {User} = require('./db.js');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { decode } = require('jsonwebtoken');
const bcript =require("bcrypt")
const { TOKEN_SECRET, CLIENT_ID_FB, CLIENT_SECRET_FB, CLIENT_ID_GO, CLIENT_SECRET_GO, URL_FB, URL_GO} = process.env

module.exports = function (passport){
   
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
          },(email,password,done)=>{
              console.log(email)
            User.findOne({where:{email:email}})
            .then(user=>{
               
                if(!user) return done(null,false);
                bcrypt.compare(password, user.password,(err,result) =>{
                    if (err) throw err;
                    if (result===true){
                        return done(null,user);
                    }else{
                        return done(null,false);
                    }
                })
            }).catch(e=>{
                console.log(e);
            })
        })
    );

    passport.use(
        new JWTStrategy({
            secretOrKey: TOKEN_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },async (token,done)=>{
            try {
                return done(null,token.user);
            } catch (error) {   
                done(error);
            }
        })
    );   
    
    
    passport.use(new FacebookStrategy({
        clientID: CLIENT_ID_FB,
        clientSecret: CLIENT_SECRET_FB,
        callbackURL: URL_FB || "http://localhost:3001/user/login_fb"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({id:profile.id}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      }
    ));

    passport.use(new GoogleStrategy({
        clientID: CLIENT_ID_GO,
        clientSecret: CLIENT_SECRET_GO,
        callbackURL: URL_GO || "http://localhost:3001/login/auth/google/login"
      },
      function (accessToken, refreshToken,profile, cb)  {
          (async()=>{
          const hashPassword  = await bcript.hash(profile.id,10)
          console.log(hashPassword)
        User.findOrCreate({where:{ googleId: profile.id },defaults:{
            username: profile.displayName,
            email: profile.emails[0].value,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName,
            password: hashPassword,
            photoURL: profile.photos.value,
            isAdmin: false,
        }})
        .then(user=>{
            cb(null,user)
        }).catch(err=>{
            cb(err,null)
        })
    })()}
    ))

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((id, done) => {
        done(null, user);
    });


}
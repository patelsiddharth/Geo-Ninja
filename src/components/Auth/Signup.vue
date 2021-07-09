<template>
    <div class="signup container">
        <form class="card-panel" @submit.prevent="HandleSignUp">
            <h2 class="center deep-purple-text">Sign Up</h2>
            <div class="field">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input type="password" name="password" v-model="password">
            </div>
            <div class="field">
                <label for="alias">Alias</label>
                <input type="text" name="alias" v-model="alias" autocomplete="off">
            </div>
            <p class="red-text center" v-if="feedback">{{feedback}}</p>
            <div class="field center">
                <button class="btn deep-purple">Sign Up</button>
            </div>
        </form>
    </div>
</template>

<script>
import slugify from 'slugify';
import fireStore from '../../Firebase/init';
import firebase from 'firebase';

export default {
    name : "Signup",
    data()
    {
        return{
            email : null,
            password : null,
            alias : null,
            feedback : null,
            slug : null
        }
    },
    methods : {
        HandleSignUp()
        {
            if(this.alias && this.email && this.password)
            {
                this.slug = slugify(this.alias , {
                    replacement : '-',
                    remove : /[$*_+`.()'"!\-:@]/g,
                    lower : true
                })
                const ref = fireStore.collection('users').doc(this.slug)
                ref.get().then((doc) => {
                    if(doc.exists)
                    {
                        this.feedback = 'This alias already exist. Please try with a new alias.'
                    }
                    else
                    {
                        this.feedback = 'Noice'
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                            .then((cred) => {
                                console.log(cred.user);
                                ref.set({
                                    alias : this.alias,
                                    geolocation : null,
                                    user_id : cred.user.uid
                                })
                            })
                            .then(() => {
                                this.$router.push({ name : 'GMap' })
                            })
                            .catch(err => {
                                this.feedback = err.message;
                                console.log(err);
                            })
                    }
                })
                console.log(this.slug);
            }
            else
            {
                this.feedback = 'You must add an alias to continue.'
            }
        }
    }
}
</script>

<style>
.signup
{
    max-width: 400px;
    margin-top: 60px;
}
.signup h2
{
    font-size: 2.4em;
}
.signup .field
{
    margin-bottom: 16px;
}
</style>
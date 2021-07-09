<template>
    <div class="container view-profile">
        <div v-if="profile" class="card">
            <h2 class="center deep-purple-text">{{profile.alias}}'s Wall</h2>
            <ul class="comments collection">
                <li v-for="(comment, index) in comments" :key="index">
                    <div class="deep-purple-text">{{comment.from}}</div>
                    <div class="grey-text text-darken-2">{{comment.content}}</div>
                </li>
            </ul>
            <form @submit.prevent="addComment">
                <div class="field">
                    <label for="comment">Add a comment</label>
                    <input type="text" name="comment" v-model="newComment">
                </div>
                <p class="red-text center" v-if="feedback">{{feedback}}</p>
            </form>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import db from '../../Firebase/init';

export default {
    data()
    {
        return{
            user : null,
            profile : null,
            newComment : null,
            feedback : null,
            comments : []
        }
    },
    methods : {
        addComment()
        {
            if(this.newComment)
            {
                this.feedback = null;
                db.collection('comments').add({
                    to : this.$route.params.id,
                    from : this.user.alias,
                    content : this.newComment,
                    time : Date.now()
                }).then(() => {
                    this.newComment = null;
                })
            }
            else
            {
                this.feedback = 'Please add a comment.';
            }
        }
    },
    created()
    {
        let ref = db.collection('users')

        // Get Current user
        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.user = doc.data(),
                    this.user.id = doc.id
                })
            })

        // Profile data
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data();
        })

        // Comments
        db.collection('comments').where('to', '==', this.$route.params.id).orderBy('time')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                this.comments.unshift({
                    from : change.doc.data().from,
                    content : change.doc.data().content
                })  
            })
        })
    }
}
</script>

<style>
.view-profile .card
{
    padding: 20px;
    margin-top: 60px;
}
.view-profile h2
{
    font-size: 2em;
    margin-top: 0;
}
.view-profile li
{
    padding: 10px;
    border-bottom: 1px solid #eee;
}
</style>
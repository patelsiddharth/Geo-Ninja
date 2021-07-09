<template>
    <div class="map">
        <div class="google-maps" id="map"></div>
    </div>
</template>

<script>
import firebase from 'firebase';
import fireStore from '../../Firebase/init';

export default {
    name : 'GMap',
    data()
    {
        return{
            lat : null,
            lng : null
        }
    },
    methods : {
        renderMap(){
            mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkZGhhcnRoMTc3IiwiYSI6ImNra29lMmt0ODAxeGkydnA2ZHlyMnM3MXIifQ.9iM6rVBknl7eod-lRvCdnQ';
            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [this.lng, this.lat], // starting position [lng, lat]
                zoom: 6 // starting zoom
            });
            fireStore.collection('users').get().then(users => {
                users.docs.forEach(doc => {
                    let data = doc.data();
                    if(data.geolocation)
                    {
                        let marker = new mapboxgl.Marker({ color: "red" }).setLngLat([this.lng, this.lat]).addTo(map);

                        marker.getElement().addEventListener('click', () => {
                            console.log(doc);
                            console.log(data);
                            this.$router.push({name : 'ViewProfile', params : {id : doc.id}});
                        })  
                    }
                })
            })
        }
    },
    mounted()
    {
        let user = firebase.auth().currentUser;

        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(pos => {
                this.lat = pos.coords.latitude
                this.lng = pos.coords.longitude
                
                fireStore.collection('users').where('user_id', '==', user.uid).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            fireStore.collection('users').doc(doc.id).update({
                                geolocation : {
                                    lat : pos.coords.latitude,
                                    lng : pos.coords.longitude
                                }
                            })
                        })
                    })
                    .then(() => {
                        this.renderMap();
                    })
            }, err => {
                console.log(err);
                this.renderMap();
            }, { maximumAge : 60000, timeout : 3000})
        }
        else
        {    
            this.renderMap();
        }
    }
}
</script>

<style>
.google-maps
{
    /* width: 100%;
    height: 93vh;
    margin: 0 auto;
    background: #fff; */
    position: absolute; top: 0; bottom: 0; width: 100%;
    z-index: -1;
}
</style>
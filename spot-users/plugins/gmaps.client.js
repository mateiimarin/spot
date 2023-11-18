
export default defineNuxtPlugin(async nuxtApp => {

    let mapsAPI = new Promise((resolve) => {
        nuxtApp.hook('app:mounted', async () => {
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
            ({key: "AIzaSyA49xxLBP5KmrxeY5JocpLkQUNTobKhek0", v: "weekly"});

            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            const { Autocomplete } = await google.maps.importLibrary("places");
            const { DistanceMatrixService, DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");
            
            resolve({ 
                Map: Map, 
                AdvancedMarkerElement: AdvancedMarkerElement, 
                Autocomplete: Autocomplete, 
                DistanceMatrixService: DistanceMatrixService,
                DirectionsService: DirectionsService,
                DirectionsRenderer: DirectionsRenderer,
            });
            
        })
    })

    const getGoogleMaps = async () => {
        const { Map, AdvancedMarkerElement } = await mapsAPI;
        return { Map, AdvancedMarkerElement};
    }

    const getGooglePlaces = async () => {
        const { Autocomplete } = await mapsAPI;
        return { Autocomplete };
    }

    const getGoogleRoutes = async () => {
        const { DistanceMatrixService, DirectionsService, DirectionsRenderer } = await mapsAPI;
        return { DistanceMatrixService, DirectionsService, DirectionsRenderer};
    }


    nuxtApp.vueApp.provide('maps', getGoogleMaps());
    nuxtApp.provide('maps', getGoogleMaps());

    nuxtApp.vueApp.provide('places', getGooglePlaces());
    nuxtApp.provide('places', getGooglePlaces());

    nuxtApp.vueApp.provide('routes', getGoogleRoutes());
    nuxtApp.provide('routes', getGoogleRoutes());

    await getParkings();

  })
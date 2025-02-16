import { NextResponse } from "next/server";
import OpenAI from "openai";
import { processAndStoreAmazonUrls } from "@/app/lib/amazon";
import { createServerSupabaseClient } from "@/lib/server-utils";


const flag = true;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    const { spotifyData, pinterestData } = await request.json();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if profile exists, if not create it
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // Skip profile creation if email is missing
      if (!user.email) {
        return NextResponse.json(
          { error: 'User email is required' },
          { status: 400 }
        );
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email // Now TypeScript knows email is defined
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }
    }

    console.log('Spotify Analysis:', spotifyData.vibeAnalysis);
    console.log('Pinterest Analysis:', pinterestData.descriptions);

    const analysis = `PERSONALITY ANALYSIS: 
    This individual's aesthetic encapsulates a fusion of vintage charm and modern sophistication, reflecting their love for introspection, authenticity, and creativity. Their style harmonizes muted tones with pops of deep blues and warm neutrals, evoking a sense of nostalgia and emotional richness. The mix of indie, alternative, and singer-songwriter music influences their preference for a space that balances classic elements with contemporary details, creating a cozy yet thought-provoking atmosphere.

    RECOMMENDED ITEMS:
    1. Vintage Record Player
    2. Dreamy Film Photography Prints
    3. Mid-Century Modern Armchair
    4. Furry Throw Blanket
    5. Modern Minimalist Wall Art
    6. Velvet Sofa
    7. Urban Skyline Artwork
    8. Serene Cloud Wall Tapestry
    9. Antique Floor Lamp
    10. Cozy Reading Nook
    11. Soft Gray Area Rug
    12. Leaf-Strewn Decorative Pillows
    13. Urban Sunset Wall Clock
    14. Elegant Architecture Print`;

    const urls = [
      {
        id: '71028d74-0fa4-43e3-aed7-8e8e6a637179',
        created_at: 0,
        title: 'Victrola Nostalgic 6-in-1 Bluetooth Record Player & Multimedia Center with Built-in Speakers - 3-Speed Turntable, CD & Cassette Player, FM Radio | Wireless Music Streaming | Mahogany',
        description: '6-in-1 ENTERTAINMENT CENTER – With vintage looks on the outside & modern features inside, listen your way; vinyl records, CDs, cassettes, AM/FM radio or stream music from your smartphone via Bluetooth or 3.5 mm Aux/headphone jack.Motor type : AC Motor',
        url_to_product: 'https://www.amazon.com/Victrola-Nostalgic-Bluetooth-Turntable-Entertainment/dp/B00NQL8Z16/ref=sr_1_1?dib=eyJ2IjoiMSJ9.idRECeQAaLJomCpfipSoX7WusKM0GtdiKhQI00orVeqQ70PZOX__fH1sPTFiDQOorUaco_ms69YnH0lyxdWSVk9v4V4qDU13-MhkXMlL0fwmzUxNMbg9sEnmOxdxH3VyCdFmMwJUmyPSSsAyZxLOp-m7bPgr1OFaQMick1f7jbJsv3Zj9uUQYMXlbbS1NjCARrgUAUwrHQ5yh2TfjJC0JbmuygX4fTj-AoBZ4XPGF5k._j5uZ2G9KIP69ReRSOF8yh_BD2q1n7vwtzWgOb9obHo&dib_tag=se&keywords=Vintage+Record+Player&qid=1739715857&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/71ANQU5q-gL._AC_SX425_.jpg',
        price: '$99.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: 'a1630ce5-f4f1-4f76-8f78-7d33a75f3b2a',
        created_at: 0,
        title: '3x5ft Thin Vinyl Lfeey Photo Background Printed Photography Dreamy Blue Theme Solid Color Backdrop for Studio Props',
        description: 'Size: 3(W)*5(H)FT / 1(W)x1.5(H)M(1meter wide x 1.5meter high).',
        url_to_product: 'https://www.amazon.com/Background-Printed-Photography-Dreamy-Backdrop/dp/B01E9U30L2/ref=sr_1_1?dib=eyJ2IjoiMSJ9.jLGhF893ZCwLQnkeL1Jo41CyQ40n4GGwdvaD0Mml0g49EpE9izJUAdMec6jo4wDQ4ul3kIl51xfpc13KPAm1k2NaXqW2z31kUva0Ju0Z-L2pQDIk51WC-SLZ_M45QiV5qK0F_pQnpCt76Q5DUrRA9x-qamH2BKeK1BL4f8h2FnTD7tIJr8tgS0kn-ClChbCLVS26ltMqk6qelEUzrJsQvzpMxx57xwr6VCWauzw21s5YaDr3KCUdoGDrHcV5ORcc2F7uM8lISVIypHkbkMtqal41q1pPSAdVWlXkWiXZ-GfA_007hNJ4ctsO5bO8kXKSkEoP50vGI7Uk4fSRScMEon48_PnLqfLIp2qhxzXagRJbSxxyv-5BVU64yK_yt9gFCIXmJHepqowDsADSenVZTsEgLrh4ayBgVy0XPXQP9PDqjL6mqGBC0wEWnaSoRJ4K.9NK1ZAJKdOEt3T2ZPBDiijsMA5Qdh1DLqyLNjUAcWuI&dib_tag=se&keywords=Dreamy+Film+Photography+Prints&qid=1739715859&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/61hKDg8+QRL._AC_SY300_SX300_.jpg',
        price: '$9.29',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: 'de782ba6-cff3-46c4-baa0-5e6681844495',
        created_at: 0,
        title: 'Karl home Accent Chair Mid-Century Modern Chair with Pillow Upholstered Lounge Arm Chair with Solid Wood Frame & Soft Cushion for Living Room, Bedroom, Balcony, Linen Beige (Low Back)',
        description: 'MID-CENTURY CHARMING - Designed with curved arms and flared legs, this accent chair with extra pillow is full of mid-century style charming; The beige color of fabric with natural wood color of frame is a nice combination, which is suitable for any style of your home decorations',
        url_to_product: 'https://www.amazon.com/Karl-home-Mid-Century-Upholstered-Cushion/dp/B0BLP4W97Y/ref=sr_1_1?dib=eyJ2IjoiMSJ9.ZLdi2tyaqUvPPZCp10PYVOKXLrdg2NHbNcBjRT1PS1gMHI_6cTlN5f8VbrJvW3_6r-fwGUXEzsvgRMpCwfOUVqVvDq3ZynX0TLBh6DKj6Ib4ETNwDGmCvIrCmwQoNZzfKUAsHbUdzY_-204lWaUs5bxzhLKEVhFHomm9zZcTBaFglKQvu9Y6BXaKInCyBTXIOSLJE2F3v7txyv_GIitgYsGL_EMBOw85h24DmKOfRaWvNApj0H9USW-OaHv5iNcR9o3gQnIgMhdJans7sE5tIshyhu7p_lgKRUi2DH7UJgGrbnZXW7fz8rO9sbGMfxANfeQz3LddiCUkl-ul3ShNqvH4nYIrZhEXL1Us-pBdbdIWteB5cqnHtvVaDUKRva6sTY-4PdepKfUD27HLi848RTg8y1J8g6Fq8_hcq0zde-rLEF4Wswh3lcQ7KDfqq4La.odTUl-u3Se_9dXVBzBExV92KJ-vlWIYHRoaugsmgclA&dib_tag=se&keywords=Mid-Century+Modern+Armchair&qid=1739715862&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/81U11HwKtIL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$129.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '68cbf1c0-e0a5-4e6e-afee-53fb7c68a3d3',
        created_at: 0,
        title: 'Bedsure Fluffy Throw Blanket Gifts for Women Men, Soft Fleece Sherpa Cozy Fuzzy Plush Warm Minky Thick Faux Fur Throw for Couch, Bed, Home Living Room Decor Valentines Blanket Gifts for Her Him, Grey',
        description: 'A Gift for Your Loved Ones: Available in multiple sizes and colors, this blanket comes pre-packaged in a festive wrap, making it the perfect Valentines Day gifts for women and men.',
        url_to_product: 'https://www.amazon.com/Bedsure-Super-Reversible-Sherpa-Blanket/dp/B07X3BX7WM/ref=sr_1_1?dib=eyJ2IjoiMSJ9.3YLpFnd5VdUvbSGpiOPu-nx0uLPlBsIF9nCHUsTIOprKwwlUXESuKyHZYFmTAPBjsKaekTD-RijLfFQ0t3drY_QVgttJ9JpamueZNQj3rLnTUaqgXU5w4HBh2M04f8N4V3RYralfIDHKFC_6SoaV5ce_AB1AF54mF1msOMBdwUJV3_dXF_PpbfugalvjZEJD-IMbpR_AOZyo1kVH7bTe5LWlttRaVf2Wq8exGn0UNNzr6y7U25YQGr7fylW83lDN6hPMrcYRngE1J8az0lnIir5pYk3s8FIXDfxm3FiNW0z1gdujIUl7NcgUZ9F9YAEyo1VmGUmax9JP0ZRKYsopDiBJeyCCDHSzA5PvLq_Y-q0RLYjmbXIBxdKvB1bgOsptBMs3FTInoz0xuSe7MkAps9mtETC_YUU70VUmF2tAhvlQwFxstTdh8dziurYC4sGK.WkYxVSL240FcRrtZTaKnNPKIBrktxXXanDweE_jvdrc&dib_tag=se&keywords=Furry+Throw+Blanket&qid=1739715864&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/A1Ajfh3EvtL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$20.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: 'b4d92c5c-08fa-47de-a44f-da2e7800458d',
        created_at: 0,
        title: 'Pigort 3 Pieces Metal Flowers Wall Arts - Rustic Farmhouse Decor Black Minimalist Flower Wall Decors for Living room Bathroom Bedroom Dining Room - Housewarming Gifts(Black, Vase-C)',
        description: 'Premium Quality: Crafted with care, these 6x13.7 inch metal wall art pieces are made to impress.',
        url_to_product: 'https://www.amazon.com/Pieces-Metal-Vase-Flowers-Wall/dp/B0CBR8CBRB/ref=sr_1_1?dib=eyJ2IjoiMSJ9.dC0G6Yrlw_7fk2dyYJwk6K3FTpBhmkTlntHk_gOanRSq4dZj0ZFNyNx-YDXgplJbPH5qcyUd6cXb6XgkQPi5n_7hlLBUvxTm4FgjecinY3xH8Lpt7FF-gr-6SJt-U_vFJpDPBSze7udA8k9ojpy-1BBBe17Yvb7OSdKTARxfLDjn5W1zS20DrQl-ZoMCJ6TgthfIMfqSL0whxv2EKwgy-LyOAeMlGkh_uaE5Bhn-HpelHvIpQD5HSb6OurT8AJqrVVtty8IqsbcwQ6x7zKokV_MC8dTk2nyCeY8y2CEpwA824xtFWAYRRcE2ri_kMJD3Qq5FZIMn_M5hKj8IbQ16CJeEWZtpUwitWT1hegyu7niX_1oRrYupViKzdnof2uQriEoJWcitI3gp40rpM0spLtBqnaYf6PcHE2u5tB6zwY1AYZbYSQ8uohFY4h7-b8DV.RVE4oYLILy1TXi4y_ELxzMq4WoMie8HBTEYeyV9fVnA&dib_tag=se&keywords=Modern+Minimalist+Wall+Art&qid=1739715866&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/61RgxmG62bL.__AC_SY300_SX300_QL70_FMwebp_.jpg',
        price: '$18.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '37555208-f6d9-4e5b-bdd1-065d39a7c2a3',
        created_at: 0,
        title: 'Acanva Luxury Modern Tight Curved Back Velvet Sofa, Minimalist Style Comfy Couch for Living Room Apartment, 3 Seater, Cream',
        description: 'Velvet',
        url_to_product: 'https://www.amazon.com/Acanva-Luxury-Minimalist-Apartment-Reception/dp/B0CDWS3291/ref=sr_1_1?dib=eyJ2IjoiMSJ9.eIboiO6f5KaazbA7v_F4Dv9LZ8cNS52V07xCNc4-rutDkEJU-pYjYO82YpNNsPHzf_07au8Q4RNYXhyuK_bVe0L4fh1o6BCg-ScTHJcVNsh0fAHoZuYDB9PQBt0tPgy86ADqXOAmWdfkbkjWVUFKYRhxEblL9CamH-S9gjoue7Yr-Lr7yq4jBin0pECLox794dWyT2VzOkN8lOtqBukXjxJesR36elCTM7oEhGTYZ8c5YEwUmR1BOiUgDXXR_D3RXbkN-P_HRosdowVZx8qw5PpiHlb-9DMCxFiDPBMliUTH5_99D04ezjcCIAAJPZe0es_EPZidzneiVMZgh9lk_yhXIQRKErbb6XuWZTAX65-3Ww3OwSDZ-C-9QkC6cDXfOBsYCsPmm_Snav5A5ihlVklRJFaPuwUolMegmeiCIkD43e9Yulqib2rd8b_fSJUS.3vvZDYyTYKIFXWYeGclzs1ID9FrAsVnN6xU6yHTc2Bk&dib_tag=se&keywords=Velvet+Sofa&qid=1739715868&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/81wGU5XQhGL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$1,987.00',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '7d99ef75-2557-4488-89d4-60cea5626b2c',
        created_at: 0,
        title: 'DJSYLIFE Panoramic St. Louis Skyline Wall Art Cityscape Picture Black and White Canvas Print Night View Urban Landscape Modern Artwork Office Bedroom Decor Framed and Ready to Hang 13.8"x47.3"',
        description: 'PERFECT SIZE FOR OVER SOFA OR BED:13.8x47.3 inches(35x120cm), total 1 panels, framed and ready to hang.Every canvas can be personalized, If you like to show your own photos/pictures on the canvas, or you want these pictures print to other size, please contact us directly.',
        url_to_product: 'https://www.amazon.com/DJSYLIFE-Panoramic-Skyline-Cityscape-Stretched/dp/B07PTY7XX9/ref=sr_1_1?dib=eyJ2IjoiMSJ9.NAuTS2-p2gfrMVdZaVX-9pqx4_6fT4w4FkN7CZWWdyuNHBUGfpHIq-0DSdcf89Ic-2TkyFK1hDjj3m6Ll5h2tJnw4fpbhrp5EHucaKB8XRtQ94J1G_ynAtm1sQzBRl2aCnXD8IBCQnqPaSUFLI-fr49Yj7hpjG7ivwnC4MVhh1DPZ6lPLS69BCo4fNOFXMXrkF60A6mtCVHh3_fGyHo5bOvWDErOSymrcejOgwr7ZVyrZIXBccwvOEO7wTxeFevshHXCqk9Iiv6tbGINxCIRfd40KIsXo0aH9hptOlho_viTCqpSdPmeRiyVYU_PgGpHKZPjSWtTPiksDeHLIO7JAROSpq8iq804aph3XnaxNm1R4B2ts0cjhtY8BPF_wSvb5z__IBIaxwkFeLPeOpOjYSt4U9oWc-IYPv9Gvv1Rvz9DHT0H33-lOpK5AkUNi-4W.dX9R95kqsWep28N--iwVE0xCDvco9T5qf5iQcfz4FFU&dib_tag=se&keywords=Urban+Skyline+Artwork&qid=1739715870&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/711DGJlrJXL.__AC_SY300_SX300_QL70_FMwebp_.jpg',
        price: '$49.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '162be6c0-3866-4a28-a1db-184d879b26c9',
        created_at: 0,
        title: 'XSHANG Pink Cloud Tapestry for Bedroom Decor, Aesthetic Home Decorations for Backdrop, Cute White Heaven Sky Tapestries, Wall Hanging for Teen Girls College Dorm, Living Room, Ceiling (59Wx79L)',
        description: 'Widely Used: Abstract Tapestry is cute, durable enough for indoor and outdoor use, dormitory tapestries, room decoration, bedspreads, curtains, tablecloths, picnic mats, beach towel throws, scarves, shawl sunscreen and more',
        url_to_product: 'https://www.amazon.com/Lshtar-Tapestry-Backdrop-Beautiful-Hanging/dp/B07Z957VV4/ref=sr_1_1?dib=eyJ2IjoiMSJ9.1Jg35G7YCuPfVJyEjhoLtbuqaKIoK8QAkzAZ7ZoTXuyTA2Mw6U4Xccl9Re15EXx6uYLcOAaOB6xvsUNmue3LdJSd96493E_q4eccJRWDHISAokwpVzvCHrslnUgs56uNcAI8apqW-g0uomJsGwT0obnWHa4zfmTcHYF33mIVmH-9sKdzpY3eI65XPmeBtBPAxJTPNr_n3ReHAMMTYh2tciE8fXXWk70AMeqJcdUs7FhX6S6WeW9-orRvWYarmBkxotacTqOhof1pSCgKP_6QKan7Rglf1FGTelvTdf69_Qln3Cul6mF0RjsvjsUkAc9YLih0OaaZT3ArgfeqJMhYsavMguWpywzmCgPA6cQ7Pmylkx4cxImWV7tpOX8inTbRw4UZ4NQAx3Bro2XrrFRNgvATUl3eYQsVvnzD5oWwAAvVMuM3T2GB85eFFL1P2EEI.6Gq2kETswnMBDABUqMpUTv4le4UGV5iCvXTwUJkbLwA&dib_tag=se&keywords=Serene+Cloud+Wall+Tapestry&qid=1739715872&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/71GYUjQiyUL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$17.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '81e5e0be-e8ba-4047-944a-0ecbe86ed1a6',
        created_at: 0,
        title: 'Dimmable Industrial Floor Lamps for Living Room, Gold Tree Standing Tall Lamps with 3 Elegant Teardrop Cage Head & 800 Lumens LED Bulbs for Bedroom Office',
        description: 'Updated Stepless Dimming( 0-100% ) Floor Lamp: Unlike the traditional non-dimmable floor lamps for living room, our dimmable floor lamp is fully Stepless Dimmable. Just simply twist it and then you can adjust the industrial floor lamp in the brightness range of 0 to 100% according to the needs of different scenes.',
        url_to_product: 'https://www.amazon.com/Dimmable-Industrial-Standing-Elegant-Teardrop/dp/B09F2PMZ5N/ref=sr_1_1?dib=eyJ2IjoiMSJ9.MozGZoko3mMLzZYwOb5Stgs9sxetzfFlOxO626-NdAoPe_3dMAmOJNvIfLP-NeVwpQH1cYX8eeLEheeSBp_6TWZOCVzTDhDnqmN9EFRMmNJVQQ77Bw5E_qTh2FqJH6HVHpjTT4D5Z4M0EYMhU_GjZjrIupVFVjaoa5bgKmppL8OssNZs0CBPBKml5tFgPlF8-5ybW1ndY7MRskpwWwZg02R3fJjk3KW9rEPDJwiR0LDIzV6awg0swAEIFQoQzE-MIUFBzqGia3cLAkYMN8I5qW7htgL_MEYmWKD4GYQxNSKxPttXGWu6ednDpAQseOaAf6hpIhyBF9rgvfF_TEbq0LscdMriwSBy7n4kipsqQJHkPePDoAC_1KRDRa1ZA1qmo0y8RfWN1fY7D5kSx0jREQbAyTp3nfLBekWSHhHLisZjZbJGuwPWhEbJS7K1kaZn.uWlcGh2coRlmDROt9VBQdFExrypIXZhEEzGk-hFKU8U&dib_tag=se&keywords=Antique+Floor+Lamp&qid=1739715874&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/71RVSyO86GL.__AC_SY445_SX342_QL70_FMwebp_.jpg',
        price: '$59.98',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '28e6bc36-0306-4fde-88ee-d9f5444236ee',
        created_at: 0,
        title: '6 Tier Tree Bookshelf with Light, Narrow Bookcase Tower, Tall Floor Standing Book Organizer with Storage Cabinet for Living Room, Bedroom and Home Office, Rustic Brown',
        description: "Expansive Storage Capacity: Elevate your home's space with our skinny vertical bookshelf; Boasting a capacity to hold 30-50 paperback books and additional storage drawer at the base for thicker books or miscellaneous items",
        url_to_product: 'https://www.amazon.com/Evermagin-Bookshelf-Bookcase-Standing-Organizer/dp/B0CYT23NS9/ref=sr_1_1?dib=eyJ2IjoiMSJ9.6Hzz-p6EXeW6J9ryIExU-fERN0tIdjdxaeQWk3fPGDiMiFZY8NvXWhuSO1tYc3gBSovd58OHjmn5PIzrx6u7V4GYPdlFyg4xds1jFB5E77HI1Od1MtHQtKZDE_3mV8BtQF_XKoj7vJlLMkXbtSIQaaVgaMu22NEbuG2PoQJWWw4cMFZQxylKfsyuvhj1s2Ob1pAxIkCkb0j-uYHCkFRnGE3GhQtis_ptxtADQQBSjRE-3sgfhJaX3Th6lO0zkVv-7b6lq_OCs8wI5evCVYaYxcOs8b0eUSbfJ1grmkWlzOeDaTXitcTHd3_SkPQLVXUdw57DaF867ci57lBuwZ62PczFcs6268JmdGWsP6Mi3eZHKEzXWC3Wjlg4zr1IyBj0I3y3NLzh9-9dMuTowi1_wgsz6uceyt5yVC4eQRMITDg9SzlNoIs7AgXsv5M7_Hsf.CAnPPaQgiSgAjpGLADUrXB30mZwyvsxDZ0dbtJUtlE0&dib_tag=se&keywords=Cozy+Reading+Nook&qid=1739715876&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/71xZCVrnrYL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$59.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '74e8c538-5775-4a92-bd36-9806aa53eef6',
        created_at: 0,
        title: 'Hutha 5x8 Large Area Rugs for Living Room, Super Soft Fluffy Modern Bedroom Rug, Tie-Dyed Light Grey Indoor Shag Fuzzy Carpets for Girls Kids Nursery Room Home Decor',
        description: 'Premium Material: Hutha large area rug is made of premium natural fibers and created through over 10 processes including dyeing, weaving, and trimming. We use hand-stitching techniques based on mechanical weaving. The grey shag rug is soft and artistic, just like stepping on a cloud and warming up your kids and family, even more better integrate into your home environment',
        url_to_product: 'https://www.amazon.com/Hutha-Bedroom-Tie-Dyed-Carpets-Nursery/dp/B0BLHKRMF5/ref=sr_1_1?dib=eyJ2IjoiMSJ9.YcS0vhWf6yA_DCil9MWupXyEKwbJ1xS9kIrkVTtOeDGrOQeJVeA-iDL8vKgLikTHS5pR7cmrK_msMPK2Tm4avU5s4rySlTkc5Fd5yaFUGxpWyf7hbuyEzW2MapY7aVAHawhvPrlt3yKxyp2LW-mAXNDdyEmW7_vpZo_PGpOXRdk1y5OldGahZwuIWAfKsrkV-7hA9MRlWTxneFEPEqD660ulP6pi_dZpwDAM4OtZiaY3UtNBat2ITo0AhwT0FslJ7zqP-u_rLtuBAy29szNi_Cg598KJ-Bo3CHTtpmpscMwLbeOGYCqiRovXp8D-Up64HBYV3yTzXbyiuKHq2wvBc4OZIxao5KW8v4RGrVncFV4kJueD7dTRFEmmE01TCg-oe7-Df6YgrSF4C5DAU_MvSTtNKtccFxQNq17SU0pwynmEVfV6bGLiQiVjK-iZPdA-.g9uiZ_yZ5_YhCq2pCt4psiTJN9gSgcMkfZWh5KWu3uc&dib_tag=se&keywords=Soft+Gray+Area+Rug&qid=1739715878&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/81zuQ1M96GL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$34.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '51e2471f-6c10-4d19-a9b0-bc3ed83727cc',
        created_at: 0,
        title: 'Leaf Pillow, Cute Decorative Throw Plant Pillow Aesthetic Decor Nature Pillow for Bed Couch, Leaves Shaped Pillow Perfect for Bedroom Living Room (Dark Green, 15 Inches)',
        description: 'Premium Materials: The leaves pillows are crafted with high-quality fabric and soft cotton fillings, ensuring a soft and fluffy feel that maintains its shape, perfect for both decorative and functional use in any space.',
        url_to_product: 'https://www.amazon.com/Pillow-Decorative-Aesthetic-Perfect-Bedroom/dp/B0DG64L451/ref=sr_1_1?dib=eyJ2IjoiMSJ9.DSAvQjgr57pAIS-huDHMq_JXOU7Tt4FQp5wLRs_f9lVSWzHFrIfm1RRvXsLVbpYdV30HdTHzO2nhJwdXaY4Ynf9H-HL7szkWWyTaPlcd0B_sWCeHXMhFLmg4xUxIypp-wwVKLp-0y5kahui5Ae5kT8N3mkF0HEXhpQ-AD4vQB6JPimY1HSwGSzuYvBRa4Um8bwe6NPCXOPUMr9kh9K5N1qkJX7xTsLPHZ3S-c0YclzeqxcJqIVaXpmIYg4jMxJ4XE24FRpQAfE8ZkCHFwxvoLN9UQd20OK7mjoWd4M8gOzhMWPW65ljgIwqYbZF6s_nrOzJEVMJKKridnSDKJbJcYH1mDlw08n_6MnZef13vXKNGCS9-9V5zD2G4SGAALotUTd3Er5DDfn-KLm5qsYw1ddkEYFanf_B8XPuR92V2l8T5oUnfj9jhNHTwnRrdKF1A.41XUggJtOKSWSPA48pd6U-AqsqmoOIzKofirSSzLQl8&dib_tag=se&keywords=Leaf-Strewn+Decorative+Pillows&qid=1739715880&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/81wWeF0z47L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$9.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: 'efd94d4c-a054-4c65-80c6-62b118ddd796',
        created_at: 0,
        title: 'USB Plug in Digital Wall Clock, Sunset Ocean Wave Design, 12/24Hr Wall Mounted Digital Clock, LED Wooden Silent Wall Clock for Living Room Bedroom Classroom Office (10In Off White)',
        description: '【12/24Hrs Format】LED wooden digital wall clock has 2 display formats, namely 12-hour format and 24-hour format. You can switch to your favorite time format by pressing the button on the back of the wall clock. Compared with the old hanging clock display, this wall clock is more suitable for modern style home decoration clocks.',
        url_to_product: 'https://www.amazon.com/DMDMBSR-Digital-Dimming-Powered-Classroom/dp/B09FKX1VJR/ref=sr_1_1?dib=eyJ2IjoiMSJ9.CUmXCM3SEr7oiKvFbUOJB6zFsLFL4abus0GyzZgopZ0gX1AaRuiH8JRaAGIh2SnR4I4Ia1_oYlWq4V4S4iq-__VJC0X3aXTZ7992q9N37YeQXi-b_ig_iyP4GF70Ge-Lciojbkmv90kIa9xS7ds4KGhEqf5jVS9jqyuDoxzjtjmPN_-6UyGLkV1UhPkHoI-9X4Zf68QwNcL-5JoRGfHqohd2QRGjxOFWr9RWc4a9KkgkC6kQxihTNR14ZFEHsdtGww3ZsRcG7okt9-bQDD-_qGQFfxOoaqOCM9BJs3SHEO1q6eCUlpNSPapsAWGmN_vFLi518rMdjOEpKJWvBpum_Z5lT9BmawXHdmkymWwC3u_X8BvIHOnLr297gYIJxOL8wXDw3rTgQCf_E_Aq5I7zM_EYhHnI6qc9HKc7I8p1fiFNGDLV2WFcBpMKuVI0nole.c9UG5DmncadmuLM1TQBga6pXpQFL8g14slynWwM8NzM&dib_tag=se&keywords=Urban+Sunset+Wall+Clock&qid=1739715883&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/61-66hSs6LL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
        price: '$23.98',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      },
      {
        id: '28b757fa-f941-4def-9a5d-d6e336337450',
        created_at: 0,
        title: '97 Decor Black White City Wall Art Print - Cityscape Pictures, Famous Architecture Landscape Artwork Wall Decor, European Buildings Poster, New York Skyline Photo (8x10 UNFRAMED)',
        description: 'CITY POSTERS: Bring the beauty of the city skyline into your home with this stunning black and white poster city. The perfect addition to any room, this city wall art captures the essence of urban architectural art tecture in a simple yet elegant design',
        url_to_product: 'https://www.amazon.com/97-Decor-Black-White-Print/dp/B0BZVM4S19/ref=sr_1_1?dib=eyJ2IjoiMSJ9.XtFV_oFt3F8MJ9vCcNj7fRojEQorE5zFeFEeXkTyxe4nbWdFrcAEjqtpp66WhToYYW5DORGLC_LBXtB8jM5qEs2Gb5QC0yZteXGuaj3Zx9LFMjVyeipPxFZWoZw6Paz94cC_y9IBiLVzkfKd7UjCn4LsxA_QNk3ldE1ywXDCap3ni_p6S4mDEhkowIy6dkwJgnSwcGGiIhe8WJhUT3x71X45O8qK1CzVH_gxMOuG0WhFTZtwAhx4NMGy4ynAhVn83zA84UIJt3QS97yWRrrP1uKIMwWhUVuJFzl1SCHpYjzQoTyrFwb5KAj_C76Y852NmZXHSf8WI7vktGbJp4Uixs7t8rGm_8nudcmcdy_gAy08ZbZqDMlm_yJG3J_b-tQt43X7B5KxL98JqyJTsG_jxxEbna22Zi884kkMAv9dy_0VhrQeBsydfme2nV7Gsxru.QnnurPs5C3g4VAovPrYijS3hY-BDW5Bn8VA4c2uIXIk&dib_tag=se&keywords=Elegant+Architecture+Print&qid=1739715885&sr=8-1',
        image_url: 'https://m.media-amazon.com/images/I/91mQmfcnVrL._AC_SX679_.jpg',
        price: '$11.99',
        profile_id: '1eaf8426-4e87-4106-b31e-44b30ad084f9'
      }
    ];

    if (flag) {
      for (const url of urls) {
        const { data, error } = await supabase
          .from('amazon_finds')
          .insert({
            title: url.title,
            description: url.description,
            url_to_product: url.url_to_product,
            image_url: url.image_url,
            price: url.price,
            profile_id: user.id,
            created_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error('Error storing Amazon find:', error);
          continue;
        }

        if (data) {
          console.log('Successfully stored:', data[0]);
        }
      }

      return NextResponse.json({
        success: true,
        data: analysis,
        amazonUrls: urls
      });
    }


    const prompt = `
      Based on this person's music and visual preferences:

      MUSIC ANALYSIS:
      ${spotifyData.vibeAnalysis}

      PINTEREST ROOM INSPIRATION KEYWORDS:
      ${pinterestData.descriptions.join(', ')}

      Please provide:
      1. A comprehensive analysis of their overall aesthetic, vibe, and interests (3-4 sentences)
      2. A curated list of exactly 15 specific furniture or decor items (2-4 words each) that would create their perfect room, taking into account both their music taste and visual preferences.
      
      Format the response as:
      PERSONALITY ANALYSIS:
      [Your analysis here]

      RECOMMENDED ITEMS:
      1. [First item]
      2. [Second item]
      ...
    `;

    const combinedAnalysis = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interior designer and personality analyst who specializes in creating personalized spaces that reflect individual style.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const amazonUrls = await handleAmazonSearch(combinedAnalysis.choices[0].message.content || '');

    // Process and store Amazon URLs
    const storedFinds = await processAndStoreAmazonUrls(amazonUrls, user.id);

    console.log(combinedAnalysis.choices[0].message.content);
    console.log(storedFinds);
    return NextResponse.json({
      success: true,
      data: combinedAnalysis.choices[0].message.content,
      amazonUrls: storedFinds
    });
  } catch (error) {
    console.error('Error in combine-analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process analysis' },
      { status: 500 }
    );
  }
}

const handleAmazonSearch = async (combinedAnalysis: string) => {
  // Extract items after "RECOMMENDED ITEMS:"
  const itemsMatch = combinedAnalysis.match(/RECOMMENDED ITEMS:\s*([\s\S]*?)(?:\n\n|$)/);
  
  if (!itemsMatch || !itemsMatch[1]) {
    console.error("No recommended items found in analysis");
    return;
  }

  // Split into array and clean up
  const itemsList = itemsMatch[1]
    .split('\n')
    .map(item => item.replace(/^\d+\.\s*/, '').trim())
    .filter(item => item.length > 0)
    .slice(0, 15); // Limit to 15 items
    
  console.log('Items List:', itemsList);
  
  try {
    // Use absolute URL with the current host
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const amazonApiUrl = `${protocol}://${host}/api/amazon`;

    const response = await fetch(amazonApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchTerms: itemsList
      })
    });

    const data = await response.json();
    console.log('Amazon API Response:', data);
    return data.items;
  } catch (error) {
    console.error('Error calling Amazon API:', error);
  }
}; 
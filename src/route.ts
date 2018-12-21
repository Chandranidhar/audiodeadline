///<reference path="app/mymusicplayer/mymusicplayer.component.ts"/>
/**
 * Created by kta pc on 6/1/2017.
 */
/**
 * Created by ipsita on 7/4/17.
 */

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeaderComponent} from 'app/header/header.component';
import {HomeComponent} from 'app/home/home.component';
import {FooterComponent} from 'app/footer/footer.component';
import {AboutAudioDeadlineComponent} from 'app/about-audio-deadline/about-audio-deadline.component';
import {CommunityComponent} from 'app/community/community.component';
import {AffiliateComponent} from 'app/affiliate/affiliate.component';
import {ContactusComponent} from 'app/contactus/contactus.component';
import {SignupComponent} from 'app/signup/signup.component';
import {LoginComponent} from 'app/login/login.component';
import {DashboardComponent} from 'app/dashboard/dashboard.component';
import {KendrickComponent} from 'app/kendrick/kendrick.component';
import {UsherComponent} from 'app/usher/usher.component';
import {SevynstreeterComponent} from 'app/sevynstreeter/sevynstreeter.component';
import {AdminaddComponent} from './app/adminadd/adminadd.component';
import {AdminlistComponent} from './app/adminlist/adminlist.component';
import {AdmineditComponent} from './app/adminedit/adminedit.component';
import {AffiliatelistComponent} from './app/affiliatelist/affiliatelist.component';
import {UserlistComponent} from './app/userlist/userlist.component';
import {MyaccountComponent} from './app/myaccount/myaccount.component';
import {UpdateprofileComponent} from './app/updateprofile/updateprofile.component';
import {ChangepasswordComponent} from './app/changepassword/changepassword.component';
import {AffiliatedashboardComponent} from './app/affiliatedashboard/affiliatedashboard.component';
import {UserdashboardComponent} from './app/userdashboard/userdashboard.component';
import {Communitysignup1Component} from './app/communitysignup1/communitysignup1.component';
import {Communitysignup2Component} from './app/communitysignup2/communitysignup2.component';
import {Communitysignup3Component} from './app/communitysignup3/communitysignup3.component';
import {ViewbrodcastComponent} from './app/viewbrodcast/viewbrodcast.component';
import {AgreementComponent} from './app/agreement/agreement.component';
import {ArtistsexchangeComponent} from './app/artistsexchange/artistsexchange.component';
import {TrainingartistsComponent} from './app/trainingartists/trainingartists.component';
import {CompetitionComponent} from './app/competition/competition.component';
import {BloglistComponent} from './app/bloglist/bloglist.component';
import {BlogaddComponent} from './app/blogadd/blogadd.component';
import {BlogeditComponent} from './app/blogedit/blogedit.component';
import {ForgotpasswordComponent} from './app/forgotpassword/forgotpassword.component';
import {AffiliatereportComponent} from './app/affiliatereport/affiliatereport.component';
import {BlogsComponent} from './app/blogs/blogs.component';
import {BlogdetailsComponent} from './app/blogdetails/blogdetails.component';
import {SponsorlistComponent} from './app/sponsorlist/sponsorlist.component';
import {ResetpasswordComponent} from './app/resetpassword/resetpassword.component';
import {AmbassadorsignupComponent} from './app/ambassadorsignup/ambassadorsignup.component';
import {AmbassadorlistComponent} from './app/ambassadorlist/ambassadorlist.component';
import {TicketsaleComponent} from './app/ticketsale/ticketsale.component';
import {CommunitysignupComponent} from './app/communitysignup/communitysignup.component';
import {ModellistComponent} from './app/modellist/modellist.component';
import {MusicianlistComponent} from './app/musicianlist/musicianlist.component';
import {DancerlistComponent} from './app/dancerlist/dancerlist.component';
import {FanlistComponent} from './app/fanlist/fanlist.component';
import {Communitysignupstep2Component} from './app/communitysignupstep2/communitysignupstep2.component';
import {GenreeditComponent} from './app/genreedit/genreedit.component';
import {GenrelistComponent} from './app/genrelist/genrelist.component';
import {GenreaddComponent} from './app/genreadd/genreadd.component';
import {AmbassadoragreementComponent} from './app/ambassadoragreement/ambassadoragreement.component';
import {AmbassadordashboardComponent} from './app/ambassadordashboard/ambassadordashboard.component';
import {HostfliistylzComponent} from './app/hostfliistylz/hostfliistylz.component';
import {PromocodeaddComponent} from "./app/promocodeadd/promocodeadd.component";
import {PromocodelistComponent} from "./app/promocodelist/promocodelist.component";
import {PromocodeeditComponent} from "./app/promocodeedit/promocodeedit.component";
import {ProductaddComponent} from "./app/productadd/productadd.component";
import {ProductlistComponent} from "./app/productlist/productlist.component";
import {ProducteditComponent} from "./app/productedit/productedit.component";
import {ProfileComponent} from "./app/profile/profile.component";   //added by chandrani
import {FanprofileComponent} from "./app/fanprofile/fanprofile.component";  //added by chandrani
import {MyprofileComponent} from "./app/myprofile/myprofile.component";
import { TrendingartistComponent } from './app/trendingartist/trendingartist.component';
import { TrendingmediaComponent } from './app/trendingmedia/trendingmedia.component';
import {ArtistxpcontactusComponent} from "./app/artistxpcontactus/artistxpcontactus.component";
import {PostfeedComponent} from "./app/postfeed/postfeed.component";
import {EditprofileComponent} from "./app/editprofile/editprofile.component";
import {PhotogalleryComponent} from "./app/photogallery/photogallery.component";
import {FavoriteartistsComponent} from "./app/favoriteartists/favoriteartists.component";
import {FriendsComponent} from "./app/friends/friends.component";
import {FriendsfeedComponent} from "./app/friendsfeed/friendsfeed.component";
import {ArtistfeedComponent} from "./app/artistfeed/artistfeed.component";
import {TrendingmusicsComponent} from "./app/trendingmusics/trendingmusics.component";
import {TrendingvideosComponent} from "./app/trendingvideos/trendingvideos.component";
import {MymusicplayerComponent} from "./app/mymusicplayer/mymusicplayer.component";
import {MyvideoComponent} from "./app/myvideo/myvideo.component";
import {MyphotosComponent} from "./app/myphotos/myphotos.component";
import {MylinkComponent} from "./app/mylink/mylink.component";
import {MediawallComponent} from "./app/mediawall/mediawall.component";


const appRoutes: Routes = [

    { path: 'header', component: HeaderComponent},
    //{ path: '', component: HomeComponent},
    { path: '', component: CommunitysignupComponent},
    { path: 'footer', component: FooterComponent},
    { path: 'aboutaudiodeadline', component: AboutAudioDeadlineComponent},
    { path: 'community', component: CommunityComponent},
    { path: 'affiliate', component: AffiliateComponent},
    { path: 'contactus', component: ContactusComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'signup/:uname', component: SignupComponent},
    { path: 'signup/:uname/:mediaid', component: SignupComponent},
    { path: 'login', component: LoginComponent},
    { path: 'kendrick', component: KendrickComponent},
    { path: 'usher', component: UsherComponent},
    { path: 'sevynstreeter', component: SevynstreeterComponent},


    { path: 'dashboard', component: DashboardComponent},
    { path: 'add-admin', component: AdminaddComponent},
    { path: 'admin-list', component: AdminlistComponent},
    { path: 'edit-admin/:id', component: AdmineditComponent},
    { path: 'affiliate-list', component: AffiliatelistComponent},
    { path: 'user-list', component: UserlistComponent},
    { path: 'my-account', component: MyaccountComponent},
    { path: 'update-profile', component: UpdateprofileComponent},
    { path: 'change-password', component: ChangepasswordComponent},
    { path: 'affiliate-dashboard', component: AffiliatedashboardComponent},
    { path: 'user-dashboard', component: UserdashboardComponent},
    { path: 'community-signup-1', component: Communitysignup1Component},
    { path: 'community-signup-2', component: Communitysignup2Component},
    { path: 'community-signup-3', component: Communitysignup3Component},
    { path: 'view-broascast', component: ViewbrodcastComponent},
    { path: 'agreement/:userid', component: AgreementComponent},
    { path: 'userprofile/:id/:name', component: ArtistsexchangeComponent},
    { path: 'profile', component: ArtistsexchangeComponent},
    { path: 'trainingartists', component: TrainingartistsComponent},
    { path: 'competition', component: CompetitionComponent},
    { path: 'blog-list', component: BloglistComponent},
    { path: 'add-blog', component: BlogaddComponent},
    { path: 'edit-blog/:id', component: BlogeditComponent},
    { path: 'forgot-password', component: ForgotpasswordComponent},
    { path: 'affiliate-report', component: AffiliatereportComponent},
    { path: 'blogs', component: BlogsComponent},
    { path: 'blog-details/:id', component: BlogdetailsComponent},
    { path: 'sponsor-list', component: SponsorlistComponent},
    { path: 'resetpassword/:accesscode', component: ResetpasswordComponent},
    { path: 'ambassador-signup', component: AmbassadorsignupComponent},
    { path: 'ambassador-signup/:uname', component: AmbassadorsignupComponent},
    { path: 'ambassador-signup/:uname/:mediaid', component: AmbassadorsignupComponent},
    { path: 'ambassador-agreement/:userid', component: AmbassadoragreementComponent},
    { path: 'ambassador-list', component: AmbassadorlistComponent},
    { path: 'ticket-sale', component: TicketsaleComponent},
    { path: 'ticket-sale/:param1', component: TicketsaleComponent},
    { path: 'ticket-sale/:param1/:param2', component: TicketsaleComponent},
    { path: 'ticket-sale/:param1/:param2/:param3', component: TicketsaleComponent},
    { path: 'community-signup', component: CommunitysignupComponent},
    { path: 'community-signup/:uname', component: CommunitysignupComponent},
    { path: 'community-signup/:uname/:mediaid', component: CommunitysignupComponent},
    { path: 'community-signup-step-2', component: Communitysignupstep2Component},
    { path: 'community-signup-step-2/:uid', component: Communitysignupstep2Component},
    { path: 'fan-list', component: FanlistComponent},
    { path: 'dancer-list', component: DancerlistComponent},
    { path: 'musician-list', component: MusicianlistComponent},
    { path: 'model-list', component: ModellistComponent},
    { path: 'add-genre', component: GenreaddComponent},
    { path: 'genre-list', component: GenrelistComponent},
    { path: 'edit-genre/:id', component: GenreeditComponent},
    { path: 'ambassador-dashboard', component: AmbassadordashboardComponent},
    { path: 'host-flii-stylz', component: HostfliistylzComponent},
    { path: 'add-promocode', component: PromocodeaddComponent},
    { path: 'promocode-list', component: PromocodelistComponent},
    { path: 'edit-promocode/:id', component: PromocodeeditComponent},
    { path: 'add-product', component: ProductaddComponent},
    { path: 'product-list', component: ProductlistComponent},
    { path: 'edit-product/:id', component: ProducteditComponent},
    { path: 'trendingartist', component: TrendingartistComponent},
    { path: 'trendingmedia', component: TrendingmediaComponent},
    { path: 'artistxp-contactus', component: ArtistxpcontactusComponent},
    { path: 'postfeed/:type/:id', component: PostfeedComponent},
    { path: 'editprofile/:id', component: EditprofileComponent},
    { path: 'trendingphotos', component: PhotogalleryComponent},
    { path: 'favoriteartists', component: FavoriteartistsComponent},
    { path: 'mediawall', component: MediawallComponent},
    { path: 'friends', component: FriendsComponent},
    { path: 'friendsfeed', component: FriendsfeedComponent},
    { path: 'artistfeed', component: ArtistfeedComponent},
    { path: 'trendingmusics', component: TrendingmusicsComponent},
    { path: 'trendingvideos', component: TrendingvideosComponent},
    { path: 'myaudioplayer/:id/:name', component: MymusicplayerComponent},
    { path: 'myvideos/:id/:name', component: MyvideoComponent},
    { path: 'myphotos/:id/:name', component: MyphotosComponent},
    { path: 'mylinks/:id/:name', component: MylinkComponent},




    // { path: 'profile/:id', component: ProfileComponent},        //added by chandrani
    { path: 'fanprofile/:id', component: FanprofileComponent},
    { path: 'myprofile', component: MyprofileComponent},
];


export const appRoutingProviders: any[] = [
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: false });
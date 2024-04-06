import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import {COLORS} from '../../components/GlobalStyle';

const PrivacyScreen1 = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    navigation.goBack('Settings1');
    return true; // Return true to prevent the default back button action
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.background}}>
      <View
        style={{
          marginTop: 15,
          marginLeft: 16,
          marginRight: 16,
          alignSelf: 'center',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>
          Privacy & Policy{' '}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          marginTop: 10,
          elevation: 4,
          marginHorizontal: 20,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          justifyContent: 'center',
        }}>
        <Text style={styles.title}> Privacy Policy</Text>
        <View
          style={{
            backgroundColor: '#ddd',
            width: '99%',
            height: 1,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: 15,
            alignSelf: 'center',
          }}
        />
      </View>
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
            elevation: 4,
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 8,
            marginTop: -5,
            marginBottom: 20,
          }}>
          <View style={{marginBottom: 50}}>
            <Text style={styles.content}>
              Basic Purpose: At postmyad.ai, we believe you should always know
              what data we collect from you and how we use it, and that you
              should have meaningful control over both. We want to empower you
              to make the best decisions about the information that you share
              with us.
            </Text>
            <Text style={styles.content1}>
              We encourage you to read this policy in full, but here are a few
              key things we hope you take away from it:
            </Text>
            <Text style={styles.content2}>
              1. postmyad.ai is a public domain and its content is immediately
              viewable and searchable by anyone around the world. You can also
              use postmyad.ai under a pseudonym if you prefer not to use your
              name. 2. When you use postmyad.ai, even if you’re just looking at
              content, we receive some personal information from you like your
              profile, the type of device you’re using and your IP address. You
              can choose to share additional information with us like your
              address book contacts and/or a public profile. We use this
              information for things like keeping your account secure and
              showing you more relevant content and ads, etc. 3. We give you
              control through your settings to limit the data we collect from
              you and how we use it, and to control things like account
              security, marketing preferences and address book contacts you’ve
              uploaded to postmyad.ai. You can also download information you
              have shared on postmyad.ai. 4. In addition to information you
              share with us, we use your activity, content you’ve read or liked
              and other information to determine what type of content you’re
              interested in, your age, the languages you speak, and other
              signals to show you more relevant content. We give you
              transparency into that information, and you can modify or correct
              it at any time. If you have questions about this policy, how we
              collect or process your personal data, or anything else related to
              our privacy practices, we want to hear from you. You can contact
              us at any time.
            </Text>
            <Text style={styles.content3}>
              I. Information You Share With Us We require certain information to
              provide our services to you. For instance, you must have an
              account in order to upload or share content on postmyad.ai. When
              you choose to share the below information with us, we collect and
              use it to operate our services.
            </Text>
            <Text style={styles.content4}>
              a. Basic Account Information You have to create an account to use
              our services. If you do choose to create an account, you must
              provide us with some personal data so that we can provide our
              services to you. On postmyad.ai this includes a display name, a
              username (for example, @postmyad.ai Influencer), a password, and
              an email address or phone number. Your display name and username
              are always public, but you can use either your real name or a
              pseudonym. If you choose to create a professional account, you
              must also provide us with your professional category, and may
              provide us with additional information, including street address,
              contact email address, and contact phone number, all of which will
              always be public. In case you transact on our platform, you will
              have to provide Tax IDs and Goods and Service Tax IDs for
              regulatory and statutory compliances. You can also create and
              manage multiple postmyad.ai accounts for example to provide
              different types of content. b. Public Information Most activity on
              postmyad.ai is public, including your profile information, your
              display language, when you created your account, and your content
              and certain information about your Content like the date, time,
              and application and version of postmyad.ai you are using. When you
              share audio or visual content on our service we may analyze that
              data to operate our services, for example by providing audio
              transcription. The lists you create, people you follow and who
              follow you, and Content you Like are also public. If you like,
              respond to or otherwise publicly engage with an ad on our
              services, that advertiser might thereby learn information about
              you associated with the ad with which you engaged such as
              characteristics of the audience the ad was intended to reach.
              Broadcasts you create are public along with when you created them.
              Your engagement with broadcasts, including viewing, listening,
              commenting, speaking, reacting to, or otherwise participating in
              them, on postmyad.ai, is public along with when you took those
              actions. Any engagement with another account’s broadcast will
              remain part of that broadcast for as long as it remains on our
              services. Information posted about you by other people who use our
              services may also be public. You are responsible for your content
              and other information you provide through our services, and you
              should think carefully about what you make public, especially if
              it is sensitive information. If you update your public information
              on postmyad.ai, such as by deleting Content or deactivating your
              account, we will reflect your updated content on postmyad.ai.,
              postmyad.ai for iOS, and postmyad.ai for Android. By publicly
              posting content, you are directing us to disclose that information
              as broadly as possible, including through our APIs, and directing
              those accessing the information through our APIs to do the same.
              To facilitate the fast global dissemination of Content to people
              around the world, we use technology like application programming
              interfaces (APIs) and embeds to make that information available to
              websites, apps, and others for their use - for example, displaying
              Content on a news website or analyzing what people say on
              postmyad.ai. We generally make this content available in limited
              quantities for free and charge licensing fees for large-scale
              access. We have standard terms that govern how this data can be
              used, and a compliance program to enforce these terms. But these
              individuals and companies are not affiliated with postmyad.ai, and
              their offerings may not reflect updates you make on postmyad.ai.
              c. Contact Information and Address Books We use your contact
              information, such as your email address or phone number, to
              authenticate your account and keep it - and our services - secure,
              and to help prevent spam, fraud, and abuse. Subject to your
              settings, we also use contact information to enable certain
              account features (for example, for login verification), to send
              you information about our services, and to personalize our
              services, including ads. If you provide us with your phone number,
              you agree to receive text messages from postmyad.ai to that number
              as your country’s laws allow. postmyad.ai also uses your contact
              information to market to you as your country’s laws allow, and to
              help others find your account if your settings permit, including
              through third- party services and client applications. You can use
              your settings for email and mobile notifications to control
              notifications you receive from postmyad.ai. You can also
              unsubscribe from a notification by following the instructions
              contained within the notification or here. You can choose to
              upload and sync your address book on postmyad.ai so that we can
              help you find and connect with people you know and help others
              find and connect with you. We also use this information to better
              recommend content to you and others. If you email us, we will keep
              the content of your message, your email address, and your contact
              information to respond to your request. d. Direct Messages and
              Non-Public Communications We provide certain features that may let
              you communicate more privately or control who sees your content.
              For example, you can use Direct Messages in future to have
              non-public conversations on postmyad.ai. When you communicate with
              others by sending or receiving Direct Messages, we will store and
              process your communications and information related to them. This
              includes link scanning for malicious content, link shortening to
              http://t.co URLs, detection of spam, abuse and prohibited images,
              and use of reported issues. We also use information about whom you
              have communicated with and when (but not the content of those
              communications) to better understand the use of our services, to
              protect the safety and integrity of our platform, and to show more
              relevant content. We share the content of your Direct Messages
              with the people you’ve sent them to; we do not use them to serve
              you ads. When you use features like Direct Messages to
              communicate, remember that recipients have their own copy of your
              communications on postmyad.ai - even if you delete your copy of
              those messages from your account - which they may duplicate,
              store, or re-share. e. Payment Information You may provide us with
              payment information, including your credit or debit card number,
              card expiration date, CVV code, and billing address, in order to
              purchase advertising or other offerings provided as part of our
              services. If you make a payment or send money using postmyad.ai
              features or services, including through an intermediary, we may
              receive information about your transaction such as when it was
              made or when a subscription is set to expire or auto-renew. f.
              Additional Information We Receive About You We receive certain
              information when you use our services or other websites or mobile
              applications that include our content, and from third parties
              including advertisers. Like the information you share with us, we
              use the data below to operate our services. a. Location
              Information We require information about your signup and current
              location, which we get from signals such as your IP address or
              device settings, to securely and reliably set up and maintain your
              account and to provide our services to you. Subject to your
              settings, we may collect, use, and store additional information
              about your location - such as your current precise position or
              places where you’ve previously used postmyad.ai - to operate or
              personalize our services including with more relevant content like
              local trends, stories, ads, and suggestions for people to follow
              b. Links / QR Codes In order to operate our services, we keep
              track of how you interact with links/QR codes across our services.
              This includes links in emails we send you and links/QR codes in
              content that appear on screens, other websites or mobile
              applications. If you click on an external link/QR codes or ad on
              our services, that advertiser or website operator might figure out
              that you came from postmyad.ai and/or location of screen, along
              with other information associated with the ad you clicked such as
              characteristics of the audience it was intended to reach. They may
              also collect other personal data from you, such as cookie
              identifiers or your IP address. c. Cookies A cookie is a small
              piece of data that is stored on your computer or mobile device.
              Like many websites, we use cookies and similar technologies to
              collect additional website usage data and to operate our services.
              Cookies are not required for many parts of our services such as
              searching and looking at public profiles. Although most web
              browsers automatically accept cookies, many browsers’ settings can
              be set to decline cookies or alert you when a website is
              attempting to place a cookie on your computer. However, some of
              our services may not function properly if you disable cookies.
              When your browser or device allows it, we use both session cookies
              and persistent cookies to better understand how you interact with
              our services, to monitor aggregate usage patterns, and to
              personalize and otherwise operate our services such as by
              providing account security, personalizing the content we show you
              including ads, and remembering your language preferences. We do
              not support the Do Not Track browser option. You can learn more
              about how we use cookies and similar technologies here. d. Log
              Data We receive information when you view content on or otherwise
              interact with our services, which we refer to as “Log Data,” even
              if you have not created an account. For example, when you visit
              our websites, sign into our services, interact with our email
              notifications, use your account to authenticate to a third-party
              service, or visit a third-party service that includes postmyad.ai
              content, we may receive information about you. This Log Data
              includes information such as your IP address, browser type,
              operating system, the referring web page, pages visited, location,
              your mobile carrier, device information (including device and
              application IDs), search terms (including those not submitted as
              queries), and cookie information. We also receive Log Data when
              you click on, view, or interact with links on our services,
              including when you install another application through
              postmyad.ai. We use Log Data to operate our services and ensure
              their secure, reliable, and robust performance. For example, we
              use Log Data to protect the security of accounts and to determine
              what content is popular on our services. We also use this data to
              improve the content we show you, including ads and to improve the
              effectiveness of our own marketing. We use information you provide
              to us and data we receive, including Log Data and data from third
              parties, to make inferences like what topics you may be interested
              in, how old you are, and what languages you speak. This helps us
              better promote and design our services for you and personalize the
              content we show you, including ads. e. postmyad.ai for Web Data
              When you view our content on third-party websites that integrate
              postmyad.ai content such as embedded timelines or content screens,
              we may receive Log Data that includes the web page you visited. We
              use this information to better understand the use of our services,
              to protect the safety and integrity of our platform, and to show
              more relevant content, including ads. We do not associate this web
              browsing history with your name, email address, phone number, or
              username, and we delete, obfuscate, or aggregate it after no
              longer than 150 days. f. Advertisers and Other Ad Partners
              Advertising revenue allows us to support and improve our services.
              We use the information described in this Privacy Policy to help
              make our advertising more relevant to you, to measure its
              effectiveness, and to help recognize your devices to serve you ads
              on and off of postmyad.ai. Our ad partners and affiliates share
              information with us such as browser cookie IDs, mobile device IDs,
              hashed email addresses, demographic or interest data, and content
              viewed or actions taken on a website or app. Some of our ad
              partners, particularly our advertisers, also enable us to collect
              similar information directly from their website or app by
              integrating our advertising technology. Information shared by ad
              partners and affiliates or collected by postmyad.ai from the
              websites and apps of ad partners and affiliates may be combined
              with the other information you share with postmyad.ai and that
              postmyad.ai receives about you described elsewhere in our Privacy
              Policy. g. Other Third Parties and Affiliates We may receive
              information about you from third parties who are not our ad
              partners, such as others on postmyad.ai, partners who help us
              evaluate the safety and quality of content on our platform, our
              corporate affiliates, and other services you link to your
              postmyad.ai account. You may choose to connect your postmyad.ai
              account to accounts on another service, and that other service may
              send us information about your account on that service. We use the
              information we receive to provide you features like cross-posting
              or cross-service authentication, and to operate our services. For
              integrations that postmyad.ai formally supports, you may revoke
              this permission at any time from your application settings; for
              other integrations, please visit the other service you have
              connected to postmyad.ai. h. Personalizing Based On Your Inferred
              Identity When you log into postmyad.ai on a browser or device, we
              will associate that browser or device with your account for
              purposes such as authentication, security, and personalization.
              Subject to your settings, we may also associate your account with
              browsers or devices other than those you use to log into
              postmyad.ai (or associate your logged-out device or browser with
              other browsers or devices). When you provide other information to
              postmyad.ai, including an email address, we associate that
              information with your postmyad.ai account. Subject to your
              settings, we may also use this information in order to infer other
              information about your identity, for example by associating your
              account with hashes of email addresses that share common
              components with the email address you have provided to
              postmyad.ai. We do this to operate and personalize our services.
              For example, if you visit websites with sports content on your
              laptop, we may show you sports-related ads on postmyad.ai for
              Android and, if the email address associated with your account
              shares components with another email address, such as shared first
              name, last name, or initials, we may later match advertisements to
              you from advertisers that were trying to reach email addresses
              containing those components. 1. Information We Share and Disclose
              As noted above, postmyad.ai is designed to broadly and instantly
              disseminate information you share publicly through our services.
              In the limited circumstances where we disclose your private
              personal data, we do so subject to your control, because it’s
              important for operating our services, or because it’s required by
              law. a. Sharing You Control We share or disclose your personal
              data with your consent or at your direction, such as when you
              authorize a third-party web client or application to access your
              account or when you direct us to share your feedback with a
              business. Similarly, to improve your experience, we work with
              third-party partners to display their video content on
              postmyad.ai. When you watch or otherwise interact with content
              from these partners, they may receive and process your personal
              data as described in their privacy policies. If you do not want
              this content to play automatically, you can adjust your auto play
              settings. If you’ve shared information like Direct Messages or
              protected Content with someone else who accesses postmyad.ai
              through a third-party service, keep in mind that the information
              may be shared with the third-party service. Subject to your
              settings, we also provide certain third parties with personal data
              to help us offer or operate our services. You can learn more about
              these partnerships in our Help Center, and you can control whether
              postmyad.ai shares your personal data in this way by using the
              “Allow additional information sharing with business partners”
              option in your Personalization and Data settings. (This setting
              does not control sharing described elsewhere in our Privacy
              Policy, such as when we share data with our service providers or
              through partnerships other than as described in our Help Center)
              b. Service Providers We engage service providers to perform
              functions and provide services for us in India and other
              countries. For example, we use a variety of third-party services
              to help operate our services, such as hosting our various blogs
              and wikis, and to help us understand the use of our services, such
              as Google Analytics. We may share your private personal data with
              such service providers subject to obligations consistent with this
              Privacy Policy and any other appropriate confidentiality and
              security measures, and on the condition that the third parties use
              your private personal data only on our behalf and pursuant to our
              instructions (service providers may use other non-personal data
              for their own benefit). We share your payment information with
              payment services providers to process payments; prevent, detect,
              and investigate fraud or other prohibited activities; facilitate
              dispute resolution such as chargebacks or refunds; and for other
              purposes associated with the acceptance of credit and debit cards.
              c. Law, Harm, and the Public Interest Notwithstanding anything to
              the contrary in this Privacy Policy or controls we may otherwise
              offer to you, we may preserve, use, share, or disclose your
              personal data or other safety data if we believe that it is
              reasonably necessary to comply with a law, regulation, legal
              process, or governmental request; to protect the safety of any
              person; to protect the safety or integrity of our platform,
              including to help prevent spam, abuse, or malicious actors on our
              services, or to explain why we have removed content or accounts
              from our services8; to address fraud, security, or technical
              issues; or to protect our rights or property or the rights or
              property of those who use our services. However, nothing in this
              Privacy Policy is intended to limit any legal defenses or
              objections that you may have to a third party’s, including a
              government’s, request to disclose your personal data. d.
              Affiliates and Change of Ownership In the event that we are
              involved in a bankruptcy, merger, acquisition, reorganization, or
              sale of assests, your personal data may be sold or transferred as
              part of that transaction. This Privacy Policy will apply to your
              personal data as transferred to the new entity. We may also
              disclose personal data about you to our corporate affiliates in
              order to help operate our services and our affiliates’ services,
              including the delivery of ads. e. Non-Personal Information We
              share or disclose non-personal data, such as aggregated
              information like the total number of times people engaged with
              your content, demographics, the number of people who clicked on a
              particular link or voted on a poll, the topics that people are
              following about in a particular location, some inferred interests,
              or reports to advertisers about how many people saw or clicked on
              their ads. 2. Managing Your Personal Information With Us You
              control the personal data you share with us. You can access or
              rectify this data at any time. You can also deactivate your
              account. We also provide you tools to object, restrict, or
              withdraw consent where applicable for the use of data you have
              provided to postmyad.ai. And we make the data you shared through
              our services portable and provide easy ways for you to contact us.
              Please note, to help protect your privacy and maintain security,
              we take steps to verify your identity before granting you access
              to your personal information or complying with deletion,
              portability, or other related requests. a. Accessing or Rectifying
              Your Personal Data If you have registered an account on
              postmyad.ai, we provide you with tools and account settings to
              access, correct, delete, or modify the personal data you provided
              to us and associated with your account. You can download certain
              account information, including your content, by following the
              instructions here. To submit a request related to access,
              modification, or deletion of your information, or someone else’s
              information if you are their authorized agent, you may also
              contact us as specified in the How To Contact Us section of our
              Privacy Policy (Additional Information or Assistance). We may
              require you to provide additional information for verification. b.
              Deletion We keep Log Data for a maximum of 24 months. If you
              follow the instructions here, your account will be deactivated.
              When deactivated, your postmyad.ai account, including your display
              name, username, and public profile, will no longer be viewable on
              postmyad.ai.com, postmyad.ai for iOS, and postmyad.ai for Android.
              For up to 30 days after deactivation it is still possible to
              restore your postmyad.ai account if it was accidentally or
              wrongfully deactivated. Keep in mind that search engines and other
              third parties may still retain copies of your public information,
              like your profile information and public Tweets, even after you
              have deleted the information from our services or deactivated your
              account. Learn more here. c. Object, Restrict, or Withdraw Consent
              When you are logged into your postmyad.ai account, you can manage
              your privacy settings and other account features here at any time.
              It may take a short amount of time for privacy settings to be
              fully reflected throughout our systems. d. Portability postmyad.ai
              provides you a means to download the information you have shared
              through our services by following the steps here. Periscope
              provides you a means to download the information you have shared
              through our services by following the steps here. e. Additional
              Information or Assistance Thoughts or questions about this Privacy
              Policy? Please let us know by contacting us here or writing to us
              at the appropriate address below. 3. Children and Our Services Our
              services are not directed to children, and you may not use our
              services if you are under the age of 18. You must also be old
              enough to consent to the processing of your personal data in your
              country (in some countries we may allow your parent or guardian to
              do so on your behalf) 4. Our Global Operations and Data Transfers
              To bring you our services, we operate globally. Where the laws of
              your country allow you to do so, you authorize us to transfer,
              store, and use your data in India and any other country where we
              operate. In some of the countries to which we transfer personal
              data, the privacy and data protection laws and rules regarding
              when government authorities may access data may vary from those of
              your country. 5. Changes to This Privacy Policy We may revise this
              Privacy Policy from time to time. The most current version of the
              policy will govern our processing of your personal data and will
              always be at https://postmyad.ai.com/privacy. If we make a change
              to this policy that, in our sole discretion, is material, we will
              notify you within postmyad.ai.com, postmyad.ai for iOS, or
              postmyad.ai for Android, via a postmyad.ai owned and operated
              postmyad.ai account (for example @postmyad.aiSupport), or by
              sending an email to the email address associated with your
              account. By continuing to access or use the Services after those
              changes become effective, you agree to be bound by the revised
              Privacy Policy. How You Control the Information You Share with Us
              Your Privacy and safety settings let you decide: • Whether you
              will be able to receive Direct Messages from anyone on postmyad.ai
              or just your followers • Whether others can find you based on your
              email or phone number • Whether you upload your address book to
              postmyad.ai for storage and use • When and where you may see
              sensitive content on postmyad.ai • Whether you want to block or
              mute other postmyad.ai accounts
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default PrivacyScreen1;

const styles = StyleSheet.create({
  headertxt: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Oswald-Bold',
    // left: 5,
    bottom: 5,
    left: 23,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    color: COLORS.background,
    fontSize: 18,
    marginLeft: 6,
    fontWeight: '700',
    padding: 3,
  },
  content: {
    fontFamily: 'Oswald-SemiBold',
    color: '#525252',
    fontSize: 14,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  content1: {
    fontFamily: 'Oswald-SemiBold',
    color: '#525252',
    fontSize: 14,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  content2: {
    fontFamily: 'Oswald-SemiBold',
    color: '#525252',
    fontSize: 14,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  content3: {
    fontFamily: 'Oswald-SemiBold',
    color: '#525252',
    fontSize: 14,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  content4: {
    fontFamily: 'Oswald-SemiBold',
    color: '#525252',
    fontSize: 14,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  content5: {},
});
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import branch, {BranchEvent} from 'react-native-branch';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = newStyles(isDarkMode);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  useEffect(() => {
    deepListeners();
  }, []);

  const creatingContentReference = async () => {
    // only canonicalIdentifier is required
    let branchUniversalObject = await branch.createBranchUniversalObject(
      'canonicalIdentifier',
      {
        locallyIndex: true,
        title: 'Cool Content!',
        contentDescription: 'Cool Content Description',
        contentMetadata: {
          ratingAverage: 4.2,
          customMetadata: {
            prop1: 'test',
            prop2: 'abc',
          },
        },
      },
    );
  };

  const creatingDeepLink = async () => {
    let linkProperties = {
      feature: 'share',
      channel: 'facebook',
    };

    let controlParams = {
      $desktop_url: 'http://desktop-url.com/monster/12345',
    };

    let {url} = await branchUniversalObject.generateShortUrl(
      linkProperties,
      controlParams,
    );
  };

  const sharingDeepLink = async () => {
    let shareOptions = {
      messageHeader: 'Check this out',
      messageBody: 'No really, check this out!',
    };
    let linkProperties = {feature: 'share', channel: 'RNApp'};
    let controlParams = {
      $desktop_url: 'http://example.com/home',
      $ios_url: 'http://example.com/ios',
    };
    let {channel, completed, error} =
      await branchUniversalObject.showShareSheet(
        shareOptions,
        linkProperties,
        controlParams,
      );
  };

  const deepListeners = async () => {
    branch.subscribe(({error, params, uri}) => {
      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }

      console.log('Params: ', params);
      console.log('uri: ', uri);

      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link'];
        // Route non-Branch URL if appropriate.
        return;
      }

      if (!params['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return;
      }

      // A Branch link was opened.
      // Route link based on data in params, e.g.

      // Get title and url for route
      const title = params.$og_title;
      const url = params.$canonical_url;
      const image = params.$og_image_url;

      // Now push the view for this URL
      // this.navigator.push({title: title, url: url, image: image});

      // params will never be null if error is null
    });

    let lastParams = await branch.getLatestReferringParams(); // params from last open
    let installParams = await branch.getFirstReferringParams(); // params from original install

    console.log('LAST PARAMS', lastParams);
    console.log('INTALL PARAMS', installParams);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.container]}>
        <Text style={styles.text}>Hello</Text>
      </View>
    </SafeAreaView>
  );
};

const newStyles = isDarkMode =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      // backgroundColor: 'red',
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    text: {
      color: '#ffffff',
    },
  });

export default App;

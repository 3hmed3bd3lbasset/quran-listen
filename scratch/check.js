const check = async () => {
  try {
    const htmlRes = await fetch('https://3hmed3bd3lbasset.github.io/quran-listen/');
    const htmlText = await htmlRes.text();
    
    // Find script src
    const match = htmlText.match(/src="([^"]+\.js)"/);
    if (!match) {
      console.log('No JS script found in HTML');
      return;
    }
    
    const jsUrl = 'https://3hmed3bd3lbasset.github.io' + match[1];
    console.log('Fetching JS from URL:', jsUrl);
    
    const jsRes = await fetch(jsUrl);
    const jsText = await jsRes.text();
    
    console.log('JS length:', jsText.length);
    console.log('Contains "علاء عقل":', jsText.includes('علاء عقل'));
    console.log('Contains "شعيشع":', jsText.includes('شعيشع'));
  } catch (err) {
    console.error(err);
  }
};

check();

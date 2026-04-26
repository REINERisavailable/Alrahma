const { getAverageColor } = require('fast-average-color-node');

async function extract() {
  try {
    const color = await getAverageColor('./public/favicon-96x96.png');
    console.log('Dominant Color Hex:', color.hex);
  } catch (err) {
    console.error(err);
  }
}

extract();

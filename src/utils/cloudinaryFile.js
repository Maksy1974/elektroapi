const cloudinary = require("../config/cloudinary");

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    stream.end(buffer);
  });
}

function extractCloudinaryPublicId(url, folder) {
  if (!url) return null;

  const marker = `/${folder}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return null;

  const afterFolder = url.slice(markerIndex + marker.length);
  const filename = afterFolder.split("/").pop() || "";
  const withoutExt = filename.split(".")[0];

  return withoutExt ? `${folder}/${withoutExt}` : null;
}

async function removeCloudinaryAssetByUrl(url, folder) {
  const publicId = extractCloudinaryPublicId(url, folder);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
}

module.exports = {
  uploadBufferToCloudinary,
  removeCloudinaryAssetByUrl,
};

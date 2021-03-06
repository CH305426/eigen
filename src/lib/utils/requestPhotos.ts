import { ArtsyNativeModules } from "lib/NativeModules/ArtsyNativeModules"
import { Platform } from "react-native"
import ImagePicker, { Image } from "react-native-image-crop-picker"
import { osMajorVersion } from "./hardware"

export async function requestPhotos(): Promise<Image[]> {
  if (Platform.OS === "ios" && osMajorVersion() >= 14) {
    return ArtsyNativeModules.ARPHPhotoPickerModule.requestPhotos()
  } else {
    return ImagePicker.openPicker({
      mediaType: "photo",
      multiple: true,
    })
  }
}

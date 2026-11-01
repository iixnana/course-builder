import { ImageUp, Link } from 'lucide-react'
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'
import { Modal } from '../../../../../components/Modal/Modal'
import type { PickedImage } from '../../../../../../model/steps/image'
import { LinkPanel } from './LinkPanel'
import { UploadPanel } from './UploadPanel'
import './ImagePickerDialog.css'

interface ImagePickerDialogProps {
  title: string
  onPick: (image: PickedImage) => void
}

export const ImagePickerDialog = ({
  title,
  onPick,
}: ImagePickerDialogProps) => (
  <Modal title={title} hasCloseButton>
    {({ close }) => {
      const pick = (image: PickedImage) => {
        onPick(image)
        close()
      }
      return (
        <Tabs className="image-picker-tabs">
          <TabList
            aria-label="Where's the image from?"
            className="image-picker-tab-list"
          >
            <Tab id="upload" className="image-picker-tab">
              <ImageUp aria-hidden="true" />
              Upload
            </Tab>
            <Tab id="link" className="image-picker-tab">
              <Link aria-hidden="true" />
              Link
            </Tab>
          </TabList>
          <TabPanel
            id="upload"
            className="image-picker-panel image-picker-upload"
            shouldForceMount
          >
            <UploadPanel onPick={pick} />
          </TabPanel>
          <TabPanel id="link" className="image-picker-panel" shouldForceMount>
            <LinkPanel onPick={pick} />
          </TabPanel>
        </Tabs>
      )
    }}
  </Modal>
)

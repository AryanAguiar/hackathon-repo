import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function Example() {
  return (
     <Menu as="div" className={"absolute flex text-left z-1 bg-gray-900 justify-center left-1/2"}>
      <MenuButton>My account</MenuButton>
      <MenuItems anchor="bottom">
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/settings">
            Settings
          </a>
        </MenuItem>
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/support">
            Support
          </a>
        </MenuItem>
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/license">
            License
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
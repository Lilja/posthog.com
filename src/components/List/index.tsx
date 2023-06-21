import Link from 'components/Link'
import React from 'react'
import * as NewIcons from '../NewIcons'

interface IItem {
    label: string | React.ReactNode
    icon?: string
    image?: string
    url: string
    badge?: string
    iconColor?: string
    description?: string
}

export const ListItem = ({ label, image, url, badge, icon, iconColor, description }: IItem): JSX.Element => {
    const Icon = icon && NewIcons[icon]
    return (
        <li>
            <Link
                to={url}
                className={`group flex items-center space-x-2 relative px-2 pt-1.5 pb-1 mb-1 rounded border border-b-3 border-transparent hover:border-light dark:hover:border-dark hover:translate-y-[-1px] active:translate-y-[1px] active:transition-all !text-inherit hover:!text-inherit`}
            >
                {image && <img className="icon w-12 h-12 p-2 rounded-sm" src={image} />}
                {Icon && (
                    <Icon
                        className={`w-10 h-10 p-2 ${
                            iconColor
                                ? `text-${iconColor} bg-${iconColor} bg-opacity-20`
                                : `bg-accent dark:bg-accent-dark`
                        }  rounded-sm shrink-0`}
                    />
                )}

                <span className="grid">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
                    {description && (
                        <span className="text-sm font-normal opacity-60 overflow-hidden text-ellipsis whitespace-nowrap">
                            {description}
                        </span>
                    )}
                </span>
                {badge && (
                    <span className="ml-auto inline-flex px-2 items-center text-[12px] uppercase text-opacity-50">
                        {badge}
                    </span>
                )}
            </Link>
        </li>
    )
}

export default function List({ items, className }: { items: IItem[]; className?: string }) {
    return (
        <ul className={`list-none m-0 p-0 ${className}`}>
            {items.map((item, index) => (
                <ListItem key={index} {...item} />
            ))}
        </ul>
    )
}

import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icons from './ui/icons'

export default function NewMailButton() {
    return (
        <TouchableOpacity className='absolute bottom-8 right-8 bg-blue-500 rounded-full p-5'
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
        >
            <Icons name='MailPlus' size={24} color='white' />
        </TouchableOpacity>
    )
}
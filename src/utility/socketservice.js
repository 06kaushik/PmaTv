// SocketService.js
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { FETCH_URL } from '../components/FetchApi';

import DeviceInfo from 'react-native-device-info';


const SOCKET_URL = FETCH_URL



const useSocket = (onConnectCallback) => {
    const socketRef = useRef(null);
    const [uniqueId, setUniqueId] = useState(null)
    //('jiouyihiy7toyuj;', uniqueId)


    const requestId = async () => {
        const deviceId = await DeviceInfo.getUniqueId()
        setUniqueId(deviceId)
    }

    useEffect(() => {
        requestId()
    }, [])

    useEffect(() => {
        // Initialize socket when the component mounts
        socketRef.current = io(SOCKET_URL, {
            extraHeaders: {
                macId: uniqueId
            }
        });

        // Handle connection
        socketRef.current.on('connect', () => {


            //('=== Socket connected ===');
            onConnectCallback();
        });

        // Handle disconnection
        socketRef.current.on('disconnect', () => {
            //('=== Socket disconnected ===');
        });

        // Handle errors
        socketRef.current.on('error', (error) => {
            //('Socket error:', error);
        });

        // Cleanup the socket connection when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [onConnectCallback]);

    // Expose socket functions
    const emit = (event, data = {}) => {
        //("Emit event:", event, data)
        if (socketRef.current) {
        //("Emit event 2:", event, data)
        socketRef.current.emit(event, data);
        }
    };

    const on = (event, cb) => {
        if (socketRef.current) {
            socketRef.current.on(event, cb);
        }
    };

    const removeListener = (event, cb) => {
        if (socketRef.current) {
            socketRef.current.removeListener(event, cb);
        }
    };

    return { emit, on, removeListener };
};

export default useSocket;

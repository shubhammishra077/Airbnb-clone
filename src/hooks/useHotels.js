import { useState, useEffect } from 'react';
import { searchHotels, getHotelInfo } from '../api/hotels';
import { unwrap } from '../api/axios';
import { mockProperties } from '../data/properties';

export function useHotelSearch(params) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!params) return;
    setLoading(true);

    // HotelSearchRequest exact fields: city, startDate, endDate, roomsCount, page, size
    const body = {
      city: params.city || '',
      startDate: params.checkIn || null,
      endDate: params.checkOut || null,
      roomsCount: params.guests ? parseInt(params.guests) : 1,
      page: params.page || 0,
      size: params.size || 10,
    };

    searchHotels(body)
      .then((response) => {
        // Unwrap: { timeStamp, data: Page<HotelPriceDTO> }
        const page = unwrap(response);
        console.log('Hotel search result:', page);
        setHotels(page?.content || []);
        setTotalPages(page?.totalPages || 1);
      })
      .catch((err) => {
        console.error('Hotel search failed:', err.response?.status, err.response?.data);
        // Fallback to mock data silently
        const filtered = mockProperties.filter((p) =>
          !params.city || p.city.toLowerCase().includes(params.city.toLowerCase())
        );
        setHotels(filtered);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { hotels, loading, totalPages };
}

export function useHotelDetail(hotelId) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);

    const mock = mockProperties.find((p) => String(p.id) === String(hotelId));

    getHotelInfo(hotelId)
      .then((response) => {
        const info = unwrap(response);
        console.log('Hotel info from backend:', info);
        // Valid backend response
        if (info && (info.hotel?.id || info.id || info.name)) {
          setHotel(info);
        } else if (mock) {
          setHotel({ hotel: mock, rooms: [] });
        }
      })
      .catch(() => {
        // 404 — backend doesn't have this ID, show mock visuals
        if (mock) setHotel({ hotel: mock, rooms: [] });
        else setHotel(null);
      })
      .finally(() => setLoading(false));
  }, [hotelId]);

  return { hotel, loading };
}

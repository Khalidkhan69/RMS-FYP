import { useEffect, useState } from "react";
import api from "../services/api";

function useTablet() {

  const [tablet, setTablet] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchTablet = async () => {

    try {

      const deviceId = localStorage.getItem("deviceId");

      if (!deviceId) {

        setError("Tablet is not configured.");

        setLoading(false);

        return;

      }

      const response = await api.get(

        `/customer/tablet-configuration/${deviceId}`

      );

      setTablet(response.data);

    }

    catch (err) {

      setError(

        err.response?.data?.detail ||

        "Unable to load tablet configuration."

      );

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchTablet();

  }, []);

  return {

    tablet,

    loading,

    error,

    refresh: fetchTablet

  };

}

export default useTablet;
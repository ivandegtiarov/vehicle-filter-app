// Fetch the data to generate static paths
export async function generateStaticParams() {
  const res = await fetch(
    'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
  );
  const makesData = await res.json();

  const makes = makesData.Results;
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2014 },
    (_, i) => currentYear - i
  );

  const params = makes.flatMap((make) =>
    years.map((year) => ({
      makeId: make.MakeId.toString(),
      year: year.toString(),
    }))
  );

  return params;
}

async function fetchVehicleModels(makeId, year) {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch vehicle models');
  }
  return res.json();
}

export default async function ResultPage({ params }) {
  const { makeId, year } = params;
  let vehicleModels = [];

  try {
    const data = await fetchVehicleModels(makeId, year);
    vehicleModels = data.Results;
  } catch (error) {
    return <div>Error fetching vehicle models: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Vehicle Models for Make ID {makeId} and Year {year}
      </h1>
      <ul>
        {vehicleModels.length > 0 ? (
          vehicleModels.map((model, index) => (
            <li key={`${model.Model_ID}-${index}`} className="mb-2">
              {model.Model_Name}
            </li>
          ))
        ) : (
          <p>No models found for the selected make and year.</p>
        )}
      </ul>
    </div>
  );
}

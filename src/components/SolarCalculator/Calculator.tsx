
      case 4:
        return (
          <QuestionCard
            question="Uppskattad produktion"
            description="Baserat på dina svar kan din anläggning producera:"
          >
            <div className="text-center space-y-4">
              <p className="text-3xl font-bold text-[#26292a] mb-2">
                {Math.round(data.estimatedProduction)} kW
              </p>
              <div className="text-[#26292a]/70 space-y-2 text-left">
                <p>Beräkningen baseras på:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Modern solpanelsteknik (230W/m²)</li>
                  <li>Din ungefärliga takvinkel ({data.roofAngle}°)</li>
                  <li>Takets riktning ({data.roofDirection === "south" ? "söder" : 
                                      data.roofDirection === "north" ? "norr" : 
                                      data.roofDirection === "east" ? "öster" : 
                                      data.roofDirection === "west" ? "väster" :
                                      data.roofDirection === "flat" ? "platt tak" : ""})</li>
                  <li>Antal solpaneler som får plats: {data.numberOfPanels} st (standardstorlek {PANEL_WIDTH}x{PANEL_HEIGHT}m)</li>
                  <li>Total yta solceller: {Math.round(data.actualSolarPanelArea * 100) / 100} m² (uppgiven takyta: {data.roofSize} m²)</li>
                </ul>
              </div>
            </div>
          </QuestionCard>
        );

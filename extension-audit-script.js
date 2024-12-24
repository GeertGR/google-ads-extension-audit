/**
 * Google Ads Extension Audit Script
 * Version: 1.0
 * Created: 2024
 * 
 * @description
 * This script performs a comprehensive audit of Google Ads extensions across your account.
 * It checks for the presence and proper implementation of:
 * - Sitelink Extensions
 * - Callout Extensions
 * - Structured Snippet Extensions
 * - Call Extensions
 * - Location Extensions
 * - Promotion Extensions
 * - Image Extensions
 * 
 * The script generates a detailed HTML report that includes:
 * - Overview of all extension types at account level
 * - Campaign-specific extension implementation
 * - Best practices and recommendations
 * - Detailed requirements for each extension type
 * - Status indicators and improvement suggestions
 * 
 * @author Geert Groot
 * @copyright 2024 Geert Groot. All rights reserved.
 * @link https://www.linkedin.com/in/geertgroot/
 * 
 * For questions or custom implementations, feel free to connect on LinkedIn.
 */

var CONFIG = {
    // Email settings
    EMAIL: {
        ENABLED: true,
        RECIPIENT: "YOUR_EMAIL_HERE",
        SUBJECT_PREFIX: "Extension Audit Report"
    }
};

// Array for all extension types with recommended quantities and specific requirements
var extensionTypes = [
    { 
        type: 'SITELINK', 
        key: 'sitelinks', 
        recommended: 8,
        requirements: {
            display: {
                desktop: {
                    minimum: 2,
                    maximum: 6,
                    description: "Can appear one below the other or side-by-side in 1-2 lines"
                },
                mobile: {
                    minimum: 2,
                    maximum: 8,
                    description: "Appear in a swipeable carousel or in prominent rows for top position"
                },
                video: {
                    minimum: 2,
                    maximum: 4,
                    description: "Appear below eligible ads on YouTube (mobile only)"
                }
            },
            textLimits: {
                standard: "25 characters",
                doubleWidth: "12 characters (Chinese, Japanese, Korean)"
            },
            descriptions: {
                status: "Required for unlocking enhanced ad formats",
                autoGeneration: "Google Ads can automatically generate if opted into dynamic sitelinks"
            },
            bestPractices: [
                "Create sitelinks at account level first for optimal coverage",
                "Keep link text short to allow more links to show",
                "Create links that reflect your site's navigation",
                "Add descriptions to make ads more helpful",
                "Keep dynamic sitelinks enabled for better performance",
                "Provide at least 4 sitelinks with descriptions for high-volume ad groups",
                "Use unique sitelink text to ensure multiple can show together",
                "Check scheduling alignment with ad schedules",
                "Add new sitelinks if not getting expected impressions"
            ],
            hierarchyRules: [
                "Account level sitelinks can appear in all eligible campaigns",
                "Campaign level sitelinks can appear in all eligible ad groups",
                "Only sitelinks in same branch (account > campaign > ad group) can appear together",
                "Create at level that makes sense for all subsequent portions",
                "Google chooses best sitelinks to maximize performance"
            ],
            costs: {
                search: [
                    "Free to add",
                    "Only charged for clicks",
                    "Cost equals headline click cost",
                    "Maximum 2 billable clicks per ad impression",
                    "Quick multiple clicks treated as duplicate/invalid"
                ],
                video: [
                    "Billed according to campaign format and goal",
                    "TrueView/Video action: Cost-per-thousand impressions (CPM)",
                    "May decrease cost-per-action (CPA)"
                ]
            },
            features: [
                "Easy updates without creating new ads",
                "Detailed click data and statistics",
                "Conversion tracking for landing pages",
                "Edit without losing performance data",
                "Schedule with start/end dates, days, times"
            ],
            compatibility: [
                "Search campaigns",
                "Video campaigns on YouTube",
                "AdSense for Search"
            ]
        }
    },
    { 
        type: 'CALLOUT', 
        key: 'callouts', 
        recommended: 10,
        requirements: {
            characterLimit: 25,
            display: {
                desktop: "Separated by dots and listed on a single line",
                mobile: "Wrap in paragraph form"
            },
            bestPractices: [
                "Account level: General information applicable to entire business (e.g., '24/7 phone support')",
                "Campaign level: Information relevant to specific campaigns",
                "Ad group level: Specific information (e.g., 'free gift wrapping')"
            ],
            features: [
                "No cost to add",
                "Can show up to 10 callouts per ad",
                "Can be scheduled by date, day of week, or time of day",
                "Available for Search Network campaigns"
            ]
        }
    },
    { 
        type: 'STRUCTURED_SNIPPET', 
        key: 'snippets', 
        recommended: 4,
        requirements: {
            display: {
                desktop: "Up to 2 headers at a time",
                mobile: "One header at a time"
            },
            headers: [
                "Amenities",
                "Brands",
                "Courses",
                "Degree programs",
                "Destinations",
                "Featured hotels",
                "Insurance coverage",
                "Models",
                "Neighborhoods",
                "Service catalog",
                "Shows",
                "Styles",
                "Types"
            ],
            bestPractices: [
                "Create snippets at account level first for optimal coverage",
                "Include at least 4 values per header",
                "Add multiple header-value sets to increase relevancy chances",
                "Ensure headers and values match to avoid disapproval",
                "Keep dynamic structured snippets enabled for better performance"
            ],
            features: [
                "No cost to add",
                "Shows beneath your text ad",
                "Can be scheduled by date, day of week, or time of day",
                "Available for Search Network",
                "Multiple levels can appear together within same branch"
            ]
        }
    },
    { 
        type: 'CALL', 
        key: 'calls', 
        recommended: 1,
        requirements: {
            display: {
                mobile: "Clickable call button under responsive search ad",
                desktop: "'Call us' button with phone number and QR code"
            },
            features: [
                "Same CPC as headline clicks",
                "Can set business hours for showing numbers",
                "Call reporting available for conversion tracking",
                "Works with location extensions (may override call extension number)",
                "Available for Search and Smart campaigns"
            ],
            restrictions: [
                "No vanity numbers",
                "No premium numbers",
                "No fax numbers",
                "Phone numbers must be verified",
                "Disclaimers shown for shared-cost or non-standard cost numbers"
            ],
            bestPractices: [
                "Enable call reporting for detailed conversion data",
                "Set schedules to match business hours",
                "Most specific level (ad group > campaign > account) will be used"
            ]
        }
    },
    { 
        type: 'LOCATION', 
        key: 'locations', 
        recommended: 1,
        requirements: {
            types: {
                direct: {
                    name: "Direct Store Locations",
                    description: "For businesses that own their store locations directly",
                    source: "Google Business Profile or Chain stores",
                    examples: [
                        "Store address display in ads",
                        "Distance to location",
                        "Clickable 'Call' button",
                        "Store details page with hours, phone, photos",
                        "Integration with Performance Max campaigns"
                    ]
                },
                affiliate: {
                    name: "Affiliate Store Locations",
                    description: "For manufacturers/sellers who sell through stores they don't own",
                    source: "Chain stores (General retailers/Auto dealers) or Global Location Groups",
                    examples: [
                        "Show nearest retailers carrying products",
                        "Map integration for store locations",
                        "Mobile directions to stores",
                        "Store finder functionality"
                    ]
                }
            },
            display: {
                search: {
                    description: "Shows as standard text ad with location and phone number",
                    features: [
                        "Address information",
                        "Distance to store",
                        "Clickable 'Call' button on mobile",
                        "Map integration",
                        "Store hours and details page"
                    ]
                },
                maps: "Can appear beside, above, or below search results on Google Maps and Maps app",
                display: "Shows when people are near or interested in your local area",
                youtube: "Shows on TrueView in-stream and bumper ads for nearby users"
            },
            features: [
                "Automatic closure handling with Business Profile integration",
                "Can be assigned to specific campaigns or ad groups via location groups",
                "Shows store hours and directions",
                "Integrates with Performance Max campaigns",
                "Phone number verification required",
                "Optional call reporting available"
            ],
            bestPractices: [
                "Choose appropriate location asset type (direct or affiliate)",
                "Keep Business Profile information up to date",
                "Use location groups for targeted campaign assignment",
                "Enable call reporting for tracking",
                "Verify all phone numbers",
                "Ensure all locations are verified through integrity process",
                "Monitor temporary/permanent closure status in Business Profile"
            ],
            restrictions: [
                "Can only choose one type of location asset per account",
                "Phone numbers must be verified",
                "Locations must pass integrity verification",
                "Closed locations won't show in ads",
                "Must have valid Business Profile or Chain store data"
            ]
        }
    },
    { 
        type: 'PROMOTION', 
        key: 'promotions', 
        recommended: 1,
        requirements: {
            display: {
                desktop: "Shows below your ad text",
                mobile: "Shows below your ad text"
            },
            features: [
                "Can highlight sales and special offers",
                "Can specify monetary or percentage discounts",
                "Can set promotion periods",
                "Can add occasion labels (e.g., Black Friday, Christmas)"
            ],
            bestPractices: [
                "Keep promotions up-to-date with current offers",
                "Use specific dates for time-sensitive promotions",
                "Include clear discount values or percentages",
                "Add promo codes when applicable",
                "Ensure landing pages match promotion details"
            ],
            restrictions: [
                "Must comply with promotion policy",
                "Cannot use for time-sensitive flash sales",
                "Must have accurate discount information",
                "Landing page must clearly show promotion details"
            ]
        }
    },
    { 
        type: 'IMAGE', 
        key: 'images', 
        recommended: 4,
        campaignLevelOnly: true,
        requirements: {
            accountEligibility: [
                "Account open for more than 60 days",
                "Good history of policy compliance",
                "Active campaigns with text ads",
                "Accruing spend on Search campaigns for last 28 days",
                "Not in sensitive verticals (e.g., sexual content, gambling)"
            ],
            display: {
                mobile: [
                    "3 square images side-by-side",
                    "One square image"
                ],
                desktop: [
                    "One square image",
                    "One landscape image",
                    "5 square images side-by-side",
                    "2 landscape images and one square image side-by-side",
                    "One landscape image and 3 square images side-by-side"
                ]
            },
            specifications: {
                required: "Square (1:1) aspect ratio",
                recommended: "Both Square (1:1) AND Landscape (1.91:1)",
                minResolution: {
                    square: "300x300 pixels",
                    landscape: "600x314 pixels"
                },
                recommendedResolution: {
                    square: "1200x1200 pixels",
                    landscape: "1200x628 pixels"
                },
                format: "PNG or JPG",
                maxFileSize: "5120 KB",
                safeArea: "80% of content in center"
            },
            features: [
                "Up to 20 images per campaign",
                "CPC same as headline clicks",
                "Can appear on Google Search and YouTube Search",
                "Dynamic image assets can be enabled",
                "Performance reporting per image"
            ],
            bestPractices: [
                "Add minimum 4 unique images per campaign",
                "Include both square and landscape formats",
                "Keep images relevant to ad text and landing page",
                "Use high-quality product or lifestyle imagery",
                "Focus content in center 80% of image",
                "Use simple backgrounds",
                "Test different creative styles"
            ],
            restrictions: [
                "Cannot control which format will serve (auction-dependent)",
                "Must own all legal rights to images",
                "Must meet quality and policy requirements",
                "No blurry or low quality images",
                "Must be relevant to keywords and landing page"
            ]
        }
    }
];

function main() {
    Logger.log('🚀 Starting extension audit...');
    var startTime = new Date();
    
    try {
        Logger.log('🔗 Auditing extensions...');
        var extensionResults = auditExtensions();
        Logger.log(`Extension opportunities: ${extensionResults.opportunities.length}`);
        
        Logger.log('📧 Generating and sending email report...');
        var emailBody = generateExtensionReport(extensionResults, extensionTypes);
        
        if (CONFIG.EMAIL.ENABLED) {
            sendEmail(emailBody);
        }
        
        var endTime = new Date();
        var duration = (endTime - startTime) / 1000;
        Logger.log(`✅ Extension audit completed successfully in ${duration} seconds`);
    } catch (e) {
        Logger.log('❌ Error during audit: ' + e);
        Logger.log('Stack trace: ' + e.stack);
        sendErrorNotification(e);
    }
}

function auditExtensions() {
    var results = {
        total: 0,
        issues: [],
        opportunities: [],
        summary: {
            sitelinks: 0,
            callouts: 0,
            snippets: 0,
            calls: 0,
            locations: 0,
            promotions: 0,
            images: 0,
            accountLevel: {
                sitelinks: 0,
                callouts: 0,
                snippets: 0,
                calls: 0,
                locations: 0,
                promotions: 0,
                images: 0
            }
        },
        campaignSummary: {}
    };
  
    // First retrieve account-level extensions
    extensionTypes.forEach(ext => {
      try {
        var accountQuery = `
          SELECT 
            asset.id,
            asset.type,
            customer_asset.status
          FROM customer_asset 
          WHERE asset.type = '${ext.type}'
          AND customer_asset.status = 'ENABLED'`;
  
        var report = AdsApp.report(accountQuery);
        var rows = report.rows();
        var count = 0;
        var assetIds = new Set();
  
        while (rows.hasNext()) {
          var row = rows.next();
          assetIds.add(row['asset.id']);
          count++;
        }
  
        results.summary.accountLevel[ext.key] = count;
            results.summary[ext.key] = count;
        Logger.log(`Account-level ${ext.type}: ${count}`);
  
            // Add extension-specific checks and recommendations
        if (ext.type === 'SITELINK') {
                const totalSitelinks = count;
                if (totalSitelinks < ext.requirements.display.desktop.minimum) {
            results.issues.push({
              type: 'sitelinks_minimum',
              severity: 'high',
                        message: `Need at least ${ext.requirements.display.desktop.minimum} sitelinks for ads to show on desktop and mobile. Currently have ${totalSitelinks}.`
                    });
                }
          results.summary.sitelinksDetails = {
            current: totalSitelinks,
                    desktop: ext.requirements.display.desktop,
                    mobile: ext.requirements.display.mobile,
                    video: ext.requirements.display.video
                };
            }

            // Similar checks for other extension types...
            // [Previous extension type checks remain the same]

      } catch (e) {
        Logger.log(`Error checking account-level ${ext.type} extensions: ${e}`);
      }
    });
  
    // Loop through all campaigns
    var campaignIterator = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .get();
  
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var campaignId = campaign.getId();
      var campaignName = campaign.getName();
  
      results.campaignSummary[campaignName] = {
        sitelinks: 0,
        callouts: 0,
        snippets: 0,
        calls: 0,
        locations: 0,
            promotions: 0,
            images: 0,
        issues: []
      };
  
      extensionTypes.forEach(ext => {
        try {
          var query = `
            SELECT 
              campaign.id, 
              asset.id,
              asset.type,
              campaign_asset.status
            FROM campaign_asset 
            WHERE campaign.id = ${campaignId}
            AND asset.type = '${ext.type}'
            AND campaign_asset.status = 'ENABLED'`;
  
          var report = AdsApp.report(query);
          var rows = report.rows();
          var campaignCount = 0;
  
          while (rows.hasNext()) {
                    rows.next();
            campaignCount++;
          }
  
          results.campaignSummary[campaignName][ext.key] = campaignCount;
  
          if (ext.recommended > 0 && campaignCount === 0) {
                    results.campaignSummary[campaignName].issues.push({
              type: 'missing_extension',
              severity: 'medium',
              extensionType: ext.type.toLowerCase(),
              message: `No ${ext.type.toLowerCase()} extensions found (recommended: ${ext.recommended})`
            });
          }
        } catch (e) {
          Logger.log(`Error checking ${ext.type} extensions for campaign ${campaignName}: ${e}`);
        }
      });
    }
  
    return results;
  }
  
function generateExtensionReport(results, extensionTypes) {
    return `
      <html>
        <head>${getEmailStyles()}</head>
        <body>
          <div class="container">
                    <h1>🔗 Extension Overview</h1>
                    
                    <h2>Account Level Extensions</h2>
              <table class="summary-table">
                <tr>
                  <th>Extension Type</th>
                  <th>Active Count</th>
                  <th>Recommended</th>
                            <th class="status-cell">Status</th>
                </tr>
                <tr>
                  <td>Sitelinks</td>
                            <td>${results.summary.sitelinks}</td>
                  <td>8+</td>
                            <td class="status-cell">${results.summary.sitelinks >= 8 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                </tr>
                <tr class="details-row">
                  <td colspan="4">
                                <p><strong>Sitelink Requirements & Best Practices:</strong></p>
                    <div class="sitelink-details">
                                    <h4>Display Format</h4>
                                    <ul>
                                        <li>Desktop:
                                            <ul>
                                                <li>Minimum ${extensionTypes[0].requirements.display.desktop.minimum} sitelinks required</li>
                                                <li>Up to ${extensionTypes[0].requirements.display.desktop.maximum} sitelinks can show</li>
                                                <li>${extensionTypes[0].requirements.display.desktop.description}</li>
                      </ul>
                                        </li>
                                        <li>Mobile:
                                            <ul>
                                                <li>Minimum ${extensionTypes[0].requirements.display.mobile.minimum} sitelinks required</li>
                                                <li>Up to ${extensionTypes[0].requirements.display.mobile.maximum} sitelinks can show</li>
                                                <li>${extensionTypes[0].requirements.display.mobile.description}</li>
                                            </ul>
                                        </li>
                                        <li>Video (YouTube):
                                            <ul>
                                                <li>Minimum ${extensionTypes[0].requirements.display.video.minimum} sitelinks required</li>
                                                <li>Up to ${extensionTypes[0].requirements.display.video.maximum} sitelinks can show</li>
                                                <li>${extensionTypes[0].requirements.display.video.description}</li>
                                            </ul>
                                        </li>
                                    </ul>

                                    <h4>Text Limits</h4>
                                    <ul>
                                        <li>Standard languages: ${extensionTypes[0].requirements.textLimits.standard}</li>
                                        <li>Double-width languages: ${extensionTypes[0].requirements.textLimits.doubleWidth}</li>
                                    </ul>

                                    <h4>Descriptions</h4>
                                    <ul>
                                        <li>Status: ${extensionTypes[0].requirements.descriptions.status}</li>
                                        <li>Auto-generation: ${extensionTypes[0].requirements.descriptions.autoGeneration}</li>
                                    </ul>

                                    <h4>Best Practices</h4>
                                    <ul>
                                        ${extensionTypes[0].requirements.bestPractices.map(practice => `<li>${practice}</li>`).join('')}
                                    </ul>

                                    <h4>Hierarchy Rules</h4>
                                    <ul>
                                        ${extensionTypes[0].requirements.hierarchyRules.map(rule => `<li>${rule}</li>`).join('')}
                                    </ul>

                                    <h4>Costs</h4>
                                    <div class="costs-container">
                                        <div class="cost-section">
                                            <h5>Search Campaigns</h5>
                                            <ul>
                                                ${extensionTypes[0].requirements.costs.search.map(cost => `<li>${cost}</li>`).join('')}
                                            </ul>
                    </div>
                                        <div class="cost-section">
                                            <h5>Video Campaigns</h5>
                                            <ul>
                                                ${extensionTypes[0].requirements.costs.video.map(cost => `<li>${cost}</li>`).join('')}
                                            </ul>
                                        </div>
                                    </div>

                                    <h4>Key Features</h4>
                                    <ul>
                                        ${extensionTypes[0].requirements.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>

                                    <h4>Campaign Compatibility</h4>
                                    <ul>
                                        ${extensionTypes[0].requirements.compatibility.map(comp => `<li>${comp}</li>`).join('')}
                                    </ul>
                                </div>
                                ${results.summary.sitelinks < 8 ? '<p class="info-text">ℹ️ Consider adding more sitelinks to maximize visibility on mobile devices.</p>' : ''}
                  </td>
                </tr>

                <tr>
                  <td>Callouts</td>
                            <td>${results.summary.callouts}</td>
                  <td>10+</td>
                            <td class="status-cell">${results.summary.callouts >= 10 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                </tr>
                <tr class="details-row">
                  <td colspan="4">
                      <p><strong>Callout Requirements & Best Practices:</strong></p>
                      <ul>
                                    <li>Character Limit: 25 characters</li>
                                    <li>Display Format:
                          <ul>
                                            <li>Desktop: Separated by dots and listed on a single line</li>
                                            <li>Mobile: Wrap in paragraph form</li>
                          </ul>
                        </li>
                                    <li>Best Practices for Different Levels:
                                        <ul>
                                            <li>Account level: General information applicable to entire business (e.g., '24/7 phone support')</li>
                                            <li>Campaign level: Information relevant to specific campaigns</li>
                                            <li>Ad group level: Specific information (e.g., 'free gift wrapping')</li>
                          </ul>
                        </li>
                                    <li>Key Features:
                                        <ul>
                                            <li>No cost to add</li>
                                            <li>Can show up to 10 callouts per ad</li>
                                            <li>Can be scheduled by date, day of week, or time of day</li>
                                            <li>Available for Search Network campaigns</li>
                          </ul>
                        </li>
                      </ul>
                                ${results.summary.callouts < 10 ? '<p class="info-text">ℹ️ Consider adding more callouts to maximize visibility. You can use up to 10 callouts per ad.</p>' : ''}
                  </td>
                </tr>

                <tr>
                  <td>Snippets</td>
                            <td>${results.summary.snippets}</td>
                  <td>4+</td>
                            <td class="status-cell">${results.summary.snippets >= 4 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                </tr>
                <tr class="details-row">
                  <td colspan="4">
                      <p><strong>Structured Snippet Details:</strong></p>
                      <ul>
                                    <li>Display Format:
                          <ul>
                                            <li>Desktop: Up to 2 headers at a time</li>
                                            <li>Mobile: One header at a time</li>
                          </ul>
                        </li>
                                    <li>Available Headers:
                                        <ul>
                                            <li>Amenities</li>
                                            <li>Brands</li>
                                            <li>Courses</li>
                                            <li>Degree programs</li>
                                            <li>Destinations</li>
                                            <li>Featured hotels</li>
                                            <li>Insurance coverage</li>
                                            <li>Models</li>
                                            <li>Neighborhoods</li>
                                            <li>Service catalog</li>
                                            <li>Shows</li>
                                            <li>Styles</li>
                                            <li>Types</li>
                          </ul>
                        </li>
                                    <li>Best Practices:
                                        <ul>
                                            <li>Create snippets at account level first for optimal coverage</li>
                                            <li>Include at least 4 values per header</li>
                                            <li>Add multiple header-value sets to increase relevancy chances</li>
                                            <li>Ensure headers and values match to avoid disapproval</li>
                                            <li>Keep dynamic structured snippets enabled for better performance</li>
                          </ul>
                        </li>
                          </ul>
                                ${results.summary.snippets < 4 ? '<p class="warning-text">⚠️ Recommended to add at least 4 values per header for better performance.</p>' : ''}
                  </td>
                </tr>

                <tr>
                  <td>Call Extension</td>
                            <td>${results.summary.calls}</td>
                  <td>1+</td>
                            <td class="status-cell">${results.summary.calls >= 1 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                </tr>
                <tr class="details-row">
                  <td colspan="4">
                      <p><strong>Call Extension Details:</strong></p>
                      <ul>
                                    <li>Display Format:
                          <ul>
                                            <li>Mobile: Clickable call button under responsive search ad</li>
                                            <li>Desktop: 'Call us' button with phone number and QR code</li>
                          </ul>
                        </li>
                                    <li>Key Features:
                                        <ul>
                                            <li>Same CPC as headline clicks</li>
                                            <li>Can set business hours for showing numbers</li>
                                            <li>Call reporting available for conversion tracking</li>
                                            <li>Works with location extensions (may override call extension number)</li>
                                            <li>Available for Search and Smart campaigns</li>
                          </ul>
                        </li>
                                    <li>Best Practices:
                                        <ul>
                                            <li>Enable call reporting for detailed conversion data</li>
                                            <li>Set schedules to match business hours</li>
                                            <li>Most specific level (ad group > campaign > account) will be used</li>
                          </ul>
                        </li>
                                    <li>Restrictions:
                                        <ul>
                                            <li>No vanity numbers</li>
                                            <li>No premium numbers</li>
                                            <li>No fax numbers</li>
                                            <li>Phone numbers must be verified</li>
                                            <li>Disclaimers shown for shared-cost or non-standard cost numbers</li>
                          </ul>
                        </li>
                      </ul>
                                ${results.summary.calls >= 1 ? '<p class="success-text">✓ Call extensions are set up. Make sure to enable call reporting and set appropriate schedules.</p>' : ''}
                  </td>
                </tr>

                <tr>
                  <td>Location Extension</td>
                  <td>${results.summary.locations}</td>
                  <td>1+</td>
                  <td class="status-cell">${results.summary.locations >= 1 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                </tr>
                <tr class="details-row">
                  <td colspan="4">
                    <p><strong>Location Extension Details:</strong></p>
                    <div class="location-details">
                      <h4>Types of Location Assets</h4>
                      <div class="location-types">
                        <div class="location-type">
                          <h4>Direct Store Locations</h4>
                          <p>${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.types.direct.description}</p>
                          <p><strong>Source:</strong> ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.types.direct.source}</p>
                          <ul>
                            ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.types.direct.examples.map(ex => `<li>${ex}</li>`).join('')}
                          </ul>
                        </div>
                        <div class="location-type">
                          <h4>Affiliate Store Locations</h4>
                          <p>${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.types.affiliate.description}</p>
                          <p><strong>Source:</strong> ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.types.affiliate.source}</p>
                          <ul>
                            ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.types.affiliate.examples.map(ex => `<li>${ex}</li>`).join('')}
                          </ul>
                        </div>
                      </div>

                      <h4>Display Format</h4>
                      <ul>
                        <li>Search:
                          <ul>
                            <li>${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.display.search.description}</li>
                            ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.display.search.features.map(feature => `<li>${feature}</li>`).join('')}
                          </ul>
                        </li>
                        <li>Maps: ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.display.maps}</li>
                        <li>Display Network: ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.display.display}</li>
                        <li>YouTube: ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.display.youtube}</li>
                      </ul>

                      <h4>Key Features</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.features.map(feature => `<li>${feature}</li>`).join('')}
                      </ul>

                      <h4>Best Practices</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.bestPractices.map(practice => `<li>${practice}</li>`).join('')}
                      </ul>

                      <h4>Restrictions</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'LOCATION').requirements.restrictions.map(restriction => `<li>${restriction}</li>`).join('')}
                      </ul>
                    </div>
                    ${results.summary.locations >= 1 ? 
                      '<p class="success-text">✓ Location extensions are set up. Keep your Business Profile or Chain store data up to date.</p>' : 
                      '<p class="warning-text">⚠️ Consider adding location extensions to help customers find your business or products.</p>'}
                  </td>
                </tr>

                <tr>
                  <td>Promotion Extension</td>
                  <td>${results.summary.promotions}</td>
                  <td>1+</td>
                  <td class="status-cell">${results.summary.promotions >= 1 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                </tr>
                <tr class="details-row">
                  <td colspan="4">
                    <p><strong>Promotion Extension Details:</strong></p>
                    <div class="promotion-details">
                      <h4>Display Format</h4>
                      <ul>
                        <li>Desktop: Shows below your ad text</li>
                        <li>Mobile: Shows below your ad text</li>
                      </ul>

                      <h4>Key Features</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'PROMOTION').requirements.features.map(feature => `<li>${feature}</li>`).join('')}
                      </ul>

                      <h4>Best Practices</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'PROMOTION').requirements.bestPractices.map(practice => `<li>${practice}</li>`).join('')}
                      </ul>

                      <h4>Restrictions</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'PROMOTION').requirements.restrictions.map(restriction => `<li>${restriction}</li>`).join('')}
                      </ul>
                    </div>
                    ${results.summary.promotions >= 1 ? '<p class="success-text">✓ Promotion extensions are set up. Keep them updated with current offers.</p>' : '<p class="warning-text">⚠️ Consider adding promotion extensions to highlight special offers and discounts.</p>'}
                  </td>
                </tr>

                <tr>
                  <td>Image Extension</td>
                  <td>Campaign Level Only</td>
                  <td>4+ per campaign</td>
                  <td class="status-cell">${results.summary.images >= 4 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                </tr>
                <tr class="details-row">
                  <td colspan="4">
                    <p><strong>Image Extension Details:</strong></p>
                    <div class="image-details">
                      <h4>Account Eligibility</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.accountEligibility.map(req => `<li>${req}</li>`).join('')}
                      </ul>

                      <h4>Display Format</h4>
                      <ul>
                        <li>Mobile:
                          <ul>
                            ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.display.mobile.map(format => `<li>${format}</li>`).join('')}
                          </ul>
                        </li>
                        <li>Desktop:
                          <ul>
                            ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.display.desktop.map(format => `<li>${format}</li>`).join('')}
                          </ul>
                        </li>
                      </ul>

                      <h4>Image Specifications</h4>
                      <ul>
                        <li>Required: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.required}</li>
                        <li>Recommended: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.recommended}</li>
                        <li>Minimum Resolution:
                          <ul>
                            <li>Square: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.minResolution.square}</li>
                            <li>Landscape: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.minResolution.landscape}</li>
                          </ul>
                        </li>
                        <li>Recommended Resolution:
                          <ul>
                            <li>Square: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.recommendedResolution.square}</li>
                            <li>Landscape: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.recommendedResolution.landscape}</li>
                          </ul>
                        </li>
                        <li>Format: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.format}</li>
                        <li>Max File Size: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.maxFileSize}</li>
                        <li>Safe Area: ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.specifications.safeArea}</li>
                      </ul>

                      <h4>Best Practices</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.bestPractices.map(practice => `<li>${practice}</li>`).join('')}
                      </ul>

                      <h4>Restrictions</h4>
                      <ul>
                        ${extensionTypes.find(ext => ext.type === 'IMAGE').requirements.restrictions.map(restriction => `<li>${restriction}</li>`).join('')}
                      </ul>
                    </div>
                    ${(() => {
                      // Check if any campaigns have image extensions
                      const campaignsWithImages = Object.values(results.campaignSummary).filter(campaign => campaign.images > 0);
                      if (campaignsWithImages.length === 0) {
                        return '<p class="warning-text">⚠️ Consider adding image extensions to make your ads more visually appealing.</p>';
                      } else {
                        const totalImages = Object.values(results.campaignSummary).reduce((sum, campaign) => sum + campaign.images, 0);
                        const campaignsNeedingMore = Object.entries(results.campaignSummary)
                          .filter(([_, data]) => data.images > 0 && data.images < 4)
                          .map(([name, _]) => name);
                        
                        if (campaignsNeedingMore.length > 0) {
                          return `<p class="info-text">ℹ️ You have ${totalImages} image extensions across ${campaignsWithImages.length} campaigns. Consider adding more images to: ${campaignsNeedingMore.join(', ')}</p>`;
                        } else {
                          return `<p class="success-text">✓ Image extensions are well configured across ${campaignsWithImages.length} campaigns with a total of ${totalImages} images.</p>`;
                        }
                      }
                    })()}
                  </td>
                </tr>
              </table>
  
                    <h2>Campaign Level Extensions</h2>
                    ${generateCampaignExtensionSummary(results)}
                    
                    ${generateActionPlan(results)}
                </div>
            </body>
        </html>
    `;
}

function generateCampaignExtensionSummary(results) {
    let html = '';
    
    for (const [campaignName, data] of Object.entries(results.campaignSummary)) {
        html += `
                <div class="campaign-extensions">
                <h3>${campaignName}</h3>
                  <table class="summary-table">
                    <tr>
                      <th>Extension Type</th>
                      <th>Account Level</th>
                      <th>Campaign Level</th>
                        <th class="status-cell">Status</th>
                    </tr>
                    <tr>
                      <td>Sitelinks</td>
                        <td>${results.summary.accountLevel.sitelinks}</td>
                        <td>${data.sitelinks}</td>
                        <td class="status-cell">${data.sitelinks >= 2 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                    </tr>
                    <tr>
                      <td>Callouts</td>
                        <td>${results.summary.accountLevel.callouts}</td>
                        <td>${data.callouts}</td>
                        <td class="status-cell">${data.callouts >= 4 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                    </tr>
                    <tr>
                      <td>Snippets</td>
                        <td>${results.summary.accountLevel.snippets}</td>
                        <td>${data.snippets}</td>
                        <td class="status-cell">${data.snippets >= 2 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                    </tr>
                    <tr>
                      <td>Call Extension</td>
                        <td>${results.summary.accountLevel.calls}</td>
                        <td>${data.calls}</td>
                        <td class="status-cell">${data.calls >= 1 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                    </tr>
                    <tr>
                      <td>Location Extension</td>
                        <td>${results.summary.accountLevel.locations}</td>
                        <td>${data.locations}</td>
                        <td class="status-cell">${data.locations >= 1 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                    </tr>
                    <tr>
                        <td>Promotion Extension</td>
                        <td>${results.summary.accountLevel.promotions}</td>
                        <td>${data.promotions}</td>
                        <td class="status-cell">${data.promotions >= 1 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                    </tr>
                    <tr>
                        <td>Image Extension</td>
                        <td>N/A</td>
                        <td>${data.images}</td>
                        <td class="status-cell">${data.images >= 4 ? '<span class="status-success">✓</span>' : '<span class="status-warning">⚠️</span>'}</td>
                  </tr>
              </table>
                ${generateCampaignIssues(data)}
            </div>
        `;
    }
    
    return html;
}

function generateCampaignIssues(data) {
    if (data.issues.length === 0) return '';
                  
                  return `
        <div class="campaign-issues">
            <p><strong>Issues:</strong></p>
            <ul>
                ${data.issues.map(issue => `<li>${issue.message}</li>`).join('')}
                  </ul>
                </div>
    `;
}
  
  function getEmailStyles() {
    return `
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
        }
        h1 {
          color: #2c5282;
          margin-bottom: 20px;
          border-bottom: 2px solid #edf2f7;
          padding-bottom: 10px;
        }
        h2 {
          color: #2d3748;
          font-size: 1.5em;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #edf2f7;
        }
        th {
          background: #f8fafc;
          font-weight: bold;
        }
        .details-row td {
          padding: 15px;
          background-color: #f8fafc;
        }
        .warning-text {
          color: #d97706;
          background: #fff7ed;
          padding: 8px;
          border-radius: 4px;
          margin: 8px 0;
        }
        .info-text {
          color: #0369a1;
          background: #f0f9ff;
          padding: 8px;
          border-radius: 4px;
          margin: 8px 0;
        }
        .success-text {
          color: #15803d;
          background: #f0fdf4;
          padding: 8px;
          border-radius: 4px;
          margin: 8px 0;
        }
      .campaign-extensions {
        margin: 20px 0;
        padding: 15px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .campaign-issues {
        margin: 10px 0;
          padding: 10px;
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        }
      .campaign-issues ul {
        margin: 5px 0;
          padding-left: 20px;
        }
      .summary-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .summary-table th,
      .summary-table td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: left;
      }
      .summary-table th {
        background-color: #f8f9fa;
        font-weight: bold;
      }
      .sitelink-details, .callout-details, .snippet-details, .call-details, .location-details {
          font-size: 0.9em;
          color: #4a5568;
          padding: 10px;
        }
      .sitelink-details ul, .callout-details ul, .snippet-details ul, .call-details ul, .location-details ul {
          margin: 8px 0;
          padding-left: 20px;
        }
      .sitelink-details li, .callout-details li, .snippet-details li, .call-details li, .location-details li {
          margin: 5px 0;
          line-height: 1.4;
        }
        .snippet-details ul {
          columns: 2;
        }
        .snippet-details ul ul {
          columns: 1;
        }
        .snippet-details li {
          break-inside: avoid;
        }
        .location-types {
          display: flex;
          gap: 20px;
          margin: 15px 0;
        }
        .location-type {
          flex: 1;
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #3182ce;
        }
        .location-type h4 {
          color: #2d3748;
          margin: 0 0 10px 0;
        }
        .location-type p {
          margin: 5px 0;
        }
      .status-cell {
        text-align: center;
        width: 60px;
      }
      
      .status-success {
        background-color: #f0fdf4;
        color: #15803d;
        padding: 4px 8px;
        border-radius: 4px;
      }
      
      .status-warning {
        background-color: #fff7ed;
        color: #d97706;
        padding: 4px 8px;
        border-radius: 4px;
      }
      .sitelink-details h4 {
          color: #2d3748;
        margin: 20px 0 10px 0;
        padding-bottom: 5px;
        border-bottom: 1px solid #e2e8f0;
      }
      .sitelink-details h5 {
        color: #4a5568;
        margin: 15px 0 8px 0;
      }
      .sitelink-details ul {
        margin: 8px 0;
        padding-left: 20px;
      }
      .sitelink-details ul ul {
        margin: 5px 0;
      }
      .sitelink-details li {
        margin: 5px 0;
        line-height: 1.5;
      }
      .costs-container {
        display: flex;
        gap: 30px;
        margin: 15px 0;
      }
      .cost-section {
        flex: 1;
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #3182ce;
      }
      .cost-section h5 {
        margin-top: 0;
        color: #2d3748;
      }
      .cost-section ul {
        margin-bottom: 0;
      }
      .sitelink-details {
        background: #ffffff;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin: 10px 0;
      }
      .action-plan {
        margin-top: 40px;
        padding: 20px;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .action-plan h2 {
        color: #2c5282;
        margin-bottom: 15px;
      }
      .action-plan h3 {
        color: #2d3748;
        margin: 25px 0 15px 0;
        font-size: 1.2em;
      }
      .action-plan p {
        color: #4a5568;
        margin-bottom: 20px;
      }
      .action-items {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .action-items li {
        margin: 15px 0;
        padding: 15px;
        border-radius: 6px;
        background: #f8fafc;
      }
      .action-items.high-priority li {
        border-left: 4px solid #e53e3e;
        background: #fff5f5;
      }
      .action-items.medium-priority li {
        border-left: 4px solid #d69e2e;
        background: #fffff0;
      }
      .action-items.low-priority li {
        border-left: 4px solid #3182ce;
        background: #ebf8ff;
      }
      .quick-tip {
        display: block;
        margin-top: 8px;
        color: #718096;
        font-style: italic;
      }
      .action-plan.success {
        background: #f0fff4;
        border: 1px solid #c6f6d5;
      }
      .action-plan.success h2 {
        color: #2f855a;
      }
      .action-plan.success p {
        color: #276749;
      }
    </style>
    `;
  }
  
  function sendEmail(htmlBody) {
    Logger.log('📧 Attempting to send email...');
    try {
      MailApp.sendEmail({
        to: CONFIG.EMAIL.RECIPIENT,
        subject: `${CONFIG.EMAIL.SUBJECT_PREFIX} - ${new Date().toLocaleDateString()}`,
        htmlBody: htmlBody
      });
        Logger.log('✅ Extension audit report email sent successfully');
    } catch (e) {
        Logger.log('❌ Error sending email: ' + e);
    }
}

function sendErrorNotification(error) {
    Logger.log('��️ Sending error notification...');
      try {
        MailApp.sendEmail({
          to: CONFIG.EMAIL.RECIPIENT,
            subject: "Error in Extension Audit Script",
            body: "An error occurred while running the extension audit script:\n\n" + error.toString()
        });
        Logger.log('✅ Error notification sent');
      } catch (e) {
        Logger.log('❌ Failed to send error notification: ' + e);
    }
}

function generateActionPlan(results) {
    const actionItems = [];
    
    // Check account level extensions
    if (results.summary.sitelinks < 8) {
        actionItems.push({
            priority: 'HIGH',
            type: 'Sitelinks',
            action: `Add ${8 - results.summary.sitelinks} more sitelink(s) at account level`,
            tip: 'Focus on your most important pages like "About Us", "Contact", "Products", or "Services"'
        });
    }
    
    if (results.summary.callouts < 10) {
        actionItems.push({
            priority: 'HIGH',
            type: 'Callouts',
            action: `Add ${10 - results.summary.callouts} more callout(s)`,
            tip: 'Include unique selling points like "Free Shipping", "24/7 Support", or "Price Match Guarantee"'
        });
    }
    
    if (results.summary.snippets < 4) {
        actionItems.push({
            priority: 'MEDIUM',
            type: 'Structured Snippets',
            action: `Add ${4 - results.summary.snippets} more structured snippet(s)`,
            tip: 'Choose relevant headers and add at least 4 values for each'
        });
    }
    
    if (results.summary.calls === 0) {
        actionItems.push({
            priority: 'HIGH',
            type: 'Call Extensions',
            action: 'Add at least 1 call extension',
            tip: 'Use your main business phone number and set appropriate call schedules'
        });
    }
    
    if (results.summary.locations === 0) {
        actionItems.push({
            priority: 'MEDIUM',
            type: 'Location Extensions',
            action: 'Link your Google Business Profile',
            tip: 'Ensure your business locations are verified and up-to-date'
        });
    }
    
    if (results.summary.promotions === 0) {
        actionItems.push({
            priority: 'LOW',
            type: 'Promotion Extensions',
            action: 'Consider adding promotion extensions',
            tip: 'Great for highlighting special offers, discounts, or seasonal promotions'
        });
    }
    
    // Check campaign level extensions
    for (const [campaignName, data] of Object.entries(results.campaignSummary)) {
        if (data.sitelinks < 2) {
            actionItems.push({
                priority: 'HIGH',
                type: 'Campaign Sitelinks',
                campaign: campaignName,
                action: `Add ${2 - data.sitelinks} more sitelink(s)`,
                tip: 'Add campaign-specific landing pages to improve relevance'
            });
        }
        
        if (data.images < 4) {
            actionItems.push({
                priority: 'MEDIUM',
                type: 'Image Extensions',
                campaign: campaignName,
                action: `Add ${4 - data.images} more image(s)`,
                tip: 'Use both square (1:1) and landscape (1.91:1) formats for better coverage'
            });
        }
    }
    
    if (actionItems.length === 0) {
        return `
            <div class="action-plan success">
                <h2>🎉 Congratulations!</h2>
                <p>All extension types are well configured. Keep monitoring their performance and testing new variations.</p>
            </div>
        `;
    }
    
    return `
        <div class="action-plan">
            <h2>📋 Action Plan</h2>
            <p>Here are the recommended steps to improve your extensions:</p>
            
            <h3>High Priority Actions</h3>
            <ul class="action-items high-priority">
                ${actionItems
                    .filter(item => item.priority === 'HIGH')
                    .map(item => `
                        <li>
                            <strong>${item.type}${item.campaign ? ` (${item.campaign})` : ''}:</strong>
                            ${item.action}
                            <br>
                            <span class="quick-tip">💡 Quick Tip: ${item.tip}</span>
                        </li>
                    `).join('')}
            </ul>
            
            <h3>Medium Priority Actions</h3>
            <ul class="action-items medium-priority">
                ${actionItems
                    .filter(item => item.priority === 'MEDIUM')
                    .map(item => `
                        <li>
                            <strong>${item.type}${item.campaign ? ` (${item.campaign})` : ''}:</strong>
                            ${item.action}
                            <br>
                            <span class="quick-tip">💡 Quick Tip: ${item.tip}</span>
                        </li>
                    `).join('')}
            </ul>
            
            <h3>Additional Opportunities</h3>
            <ul class="action-items low-priority">
                ${actionItems
                    .filter(item => item.priority === 'LOW')
                    .map(item => `
                        <li>
                            <strong>${item.type}${item.campaign ? ` (${item.campaign})` : ''}:</strong>
                            ${item.action}
                            <br>
                            <span class="quick-tip">💡 Quick Tip: ${item.tip}</span>
                        </li>
                    `).join('')}
            </ul>
        </div>
    `;
}

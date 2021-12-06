<?php
    /*******************************************************************************************************************
     *     ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗        ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
     *     ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝        ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
     *     ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗        ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
     *     ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║        ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
     *     ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║        ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
     *     ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝        ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
     *------------------------------------------------------------------------------------------------------------------
     *
     * @author     Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date       27.10.2021 01:24
     * @copyright  Copyright (C) 2005 - 2021 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     ******************************************************************************************************************/

    use Joomla\CMS\Factory;
    use Joomla\CMS\Uri\Uri;
    use Spatie\SchemaOrg\Organization;
    use Spatie\SchemaOrg\Schema;
    defined('_JEXEC') or die; // No direct access to this file

    /* @var $displayData array */
    /* @var $self object */

    /**
     * Подключается в templates/{TEMPLATE}/index.php
     *
     * # Микроразметка application/ld+json -> "@type":"Organization"
     * $layout = new \JLayoutFile( 'Organization', null, [ 'debug' => false ] );
     * $layout->addIncludePath( JPATH_LIBRARIES  . '/GNZ11/Document/SchemaOrg/' );
     * echo $layout->render( [ 'self'=>$this ]  );
     *
     *
     *
     */


    $doc = Factory::getDocument();
    extract($displayData);
    $config = \Joomla\CMS\Factory::getConfig();

    require JPATH_LIBRARIES . '/Spatie/vendor/autoload.php';

    $logo = Uri::root().'images/gbo_new.webp' ;
    $sitename = $config->get('sitename');

//    $mailfrom = $config->get('mailfrom');
    $mailfrom =  'gbo-world@mail.ru' ;

    $url = Uri::root() ;
    $sameAs['instagram'] = 'https://www.instagram.com/gboworld.ru/?utm_medium=copy_link';

    $telephone = '8(926)511-5161';
    $addressLocality = 'Москва';
    $streetAddress = 'Походный проезд, д. 5, этаж 3, оф. 309';
    $addressCountry = 'RU';
    $latitude = '55.8369665' ;
    $longitude = '37.4102307' ;
    $urlTemplate = \Joomla\CMS\Uri\Uri::root().'poisk/result?search={search_term_string}';





    $PostalAddress = Schema::PostalAddress();
    $PostalAddress->setProperty('addressLocality' , $addressLocality ) ;
    $PostalAddress->setProperty('streetAddress' , $streetAddress ) ;
    $PostalAddress->setProperty('addressCountry' , $addressCountry ) ;

    $Place = Schema::Place();
    $Place->setProperty('address' , $PostalAddress )     ;

    $GeoCoordinates = Schema::GeoCoordinates();
    $GeoCoordinates
        ->setProperty('latitude',$latitude )
        ->setProperty('longitude',$longitude );

    $Place->setProperty('geo' , $GeoCoordinates )     ;




    $schemaOrganization = Schema::Organization()
        ->logo($logo)
        ->image($logo)
        ->name( $sitename )
        ->alternateName($sitename)
        ->url($url)
        ->sameAs($sameAs['instagram'])
        ->department([
            'name'=>$sitename ,
            'image'=>$logo ,
            'address'=>$PostalAddress ,
            'telephone'=>$telephone ,
            'location'=> $Place,

        ])
    ;


    $schemaOrganization->brand(
        Schema::Brand()
            ->name( $sitename )
            ->url($url)
    );

    echo $schemaOrganization->toScript();

    $LocalBusiness = Schema::LocalBusiness();
    $LocalBusiness->setProperty('name',$sitename );
    $LocalBusiness->setProperty('image',$logo );
    $LocalBusiness->setProperty('telephone',$telephone );
    $LocalBusiness->setProperty('email',$mailfrom );
    $LocalBusiness->setProperty('priceRange','50-250000RU');
    $LocalBusiness->setProperty('url',$url );
    $LocalBusiness->setProperty('openingHours','Mo-Fr 09:00-17:00');
    $LocalBusiness->setProperty('address' , $PostalAddress )     ;
    echo $LocalBusiness->toScript();


    $WebSite =Schema::WebSite();
    $WebSite->setProperty('alternateName', $sitename );
    $WebSite->setProperty('url', $url );
//    $WebSite->setProperty('lastReviewed', date('Y-m-d') );






    $SearchAction = Schema::SearchAction();
    $EntryPoint = Schema::EntryPoint();
    $EntryPoint->setProperty('urlTemplate', $urlTemplate );
    $SearchAction->setProperty('target' , $EntryPoint );

    $PropertyValueSpecification = Schema::PropertyValueSpecification();
    $PropertyValueSpecification->setProperty('valueRequired' , 'http://schema.org/True');
    $PropertyValueSpecification->setProperty('valueName' , 'search_term_string');
    $SearchAction->setProperty('query-input' , $PropertyValueSpecification );

    $WebSite->setProperty('potentialAction', $SearchAction );

    echo $WebSite->toScript();


//    echo'<pre>';print_r( $LocalBusiness );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
//    die(__FILE__ .' '. __LINE__ );


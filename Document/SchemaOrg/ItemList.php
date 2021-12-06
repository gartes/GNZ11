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
     * @date       27.10.2021 04:48
     * @copyright  Copyright (C) 2005 - 2021 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     ******************************************************************************************************************/

    use Joomla\CMS\Factory;
    use Joomla\CMS\Uri\Uri;
    use Spatie\SchemaOrg\Schema;

    defined('_JEXEC') or die; // No direct access to this file

    /* @var $displayData array */
    /* @var $self object */

    /**
     * $layout = new \JLayoutFile( 'ItemList', null, [ 'debug' => false ] );
     * $layout->addIncludePath( JPATH_LIBRARIES  . '/GNZ11/Document/SchemaOrg/' );
     * echo $layout->render( [ 'self'=>$this ]  );
     */

    /**
     * UAH
     *
     */
    $priceCurrency = 'RUB' ;


    $doc = Factory::getDocument();
    extract($displayData);



    require JPATH_LIBRARIES . '/Spatie/vendor/autoload.php';

    $ItemList = Schema::ItemList();
    $ItemList->setProperty('url' , $doc->base );
    $ItemList->setProperty('numberOfItems' , count( $self->rows ));






    $arr = [];
    $lowPrice = 0 ;
    $highPrice = 0 ;
    foreach ( $self->rows as $i => $row)
    {

        if( !$lowPrice )  $lowPrice = $row->product_price ;  #END IF
        if( !$highPrice )  $highPrice = $row->product_price ;  #END IF

        if( $lowPrice > $row->product_price ) $lowPrice = $row->product_price; #END IF
        if( $highPrice < $row->product_price ) $highPrice = $row->product_price; #END IF


        $itemListElement = Schema::Product();
        $itemListElement->setProperty('name' , $row->name );

        $product_link = Uri::root() . $row->product_link ;
        $product_link = str_replace(Uri::root().'/' , Uri::root() , $product_link );

        $itemListElement->setProperty('url' , Uri::root() . $row->product_link );
        $itemListElement->setProperty('position' ,  $i+1 );
        $itemListElement->setProperty('image' ,  $row->image );

        $brand = Schema::Thing();
        $brand->setProperty('name' , $row->manufacturer->name );
        $itemListElement->setProperty('brand' , $brand);

        $offers = Schema::Offer();
        $offers->setProperty('priceCurrency' , $priceCurrency );


        $offers->setProperty('price' , floor( $row->product_price ) );


        $offers->setProperty('sku' , $row->product_ean );
        $itemListElement->setProperty('offers' , $offers );

        $arr[] = $itemListElement ;




    }

    $AggregateOffer = Schema::AggregateOffer();
    $AggregateOffer->setProperty('priceCurrency' , $priceCurrency );
    $AggregateOffer->setProperty('lowPrice' , $lowPrice );
    $AggregateOffer->setProperty('highPrice' , $highPrice );



    $ItemList->setProperty('itemListElement' , $arr );
    echo $ItemList->toScript();

//    echo'<pre>';print_r( $row );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
//    die(__FILE__ .' '. __LINE__ );
